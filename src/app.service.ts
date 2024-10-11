import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {Templates} from "./lib/templates";
import {env} from "./config/env";
const PuppeteerHTMLPDF = require("puppeteer-html-pdf");
import {sendMail} from "./lib/smtp";
import {Attachment} from "nodemailer/lib/mailer";
import * as path from "path";

@Injectable()
export class AppService {
  async receiveFormResponse(data): Promise<any> {
    const formData = {};
    try {
      Object.keys(data).forEach((key) => {
        let n_key = key.replace(/[^a-zA-Z0-9pćčšžđŠČĆŽĐ ]+|[ ]{2}/g,"").trim();
        n_key = n_key.split(' ').map(c => {
          if (!!c) {
            return c[0].toUpperCase() + c.substring(1)
          }
          return '';
        }).join('');
        formData[n_key] = data[key]
      })
    } catch (e) {
      throw new BadRequestException('Unable to parse JSON body')
    }

    let pdfBuffer;
    try {
      const template = Templates.getTemplate(env.FORM_TEMPLATE_PATH, env.FORM_TEMPLATE_NAME);
      const html = template(formData)

      const htmlPDF = new PuppeteerHTMLPDF();
      const options = {
        format: 'a4',
        margin: {top: 35, bottom: 35, right: 35, left: 35},
        headless: 'shell',
      }
      if (env.CHROMIUM_PATH) {
        options['executablePath'] = env.CHROMIUM_PATH;
      }
      await htmlPDF.setOptions(options);
      pdfBuffer = await htmlPDF.create(html);
      const pdfPath = path.join(env.PDF_OUTPUT_PATH, `${env.FORM_TEMPLATE_NAME}_${formData['ImeOtroka']}_${formData['PriimekOtroka']}.pdf`);
      console.log(pdfPath);
      await htmlPDF.writeFile(pdfBuffer, pdfPath.toString());
    } catch (err) {
      console.log(err)
      throw new InternalServerErrorException('Sth went wrong with pdf generation')
    }

    try {
      const mail_template = Templates.getTemplate(env.MAIL_TEMPLATE_PATH, env.MAIL_TEMPLATE_NAME);
      const mail_data = {}

      const attachment: Attachment = {
        filename: `${env.FORM_TEMPLATE_NAME}_${formData['ImeOtroka']}_${formData['PriimekOtroka']}.pdf`,
        contentType: 'application/pdf',
        content: pdfBuffer,
      };

      // let ics = null;
      // if (fs.existsSync(env.ICAL_EVENT)) {
      //   ics = fs.readFileSync(env.ICAL_EVENT, {flag: 'r', encoding: 'utf-8'})
      // }

      const recipients = [formData['ElektronskiNaslovStarša1']];
      if (formData['ElektronskiNaslovStarša2']) {
        recipients.push(formData['ElektronskiNaslovStarša2'])
      }
      const mail = {
        from: `Rod Zelene Sreče Železniki <${env.MAIL_ADDRESS}>`,
        to: recipients.join(';'),
        subject: env.MAIL_SUBJECT,
        html: mail_template(mail_data),
        attachments: [attachment],
      }
      // if (env.ICAL_EVENT && ics) {
      //   mail['icalEvent'] = {
      //     filename: 'invitation.ics',
      //         method: 'request',
      //         content: ics
      //   }
      // }
      await sendMail(mail);
    } catch (err) {
      console.log(err)
      throw new InternalServerErrorException('Sth went wrong with sending an email')
    }
  }
}
