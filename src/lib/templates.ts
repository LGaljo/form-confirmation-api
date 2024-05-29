import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { env } from '../config/env';
import { InternalServerErrorException } from '@nestjs/common';

export class Templates {
  /**
   * Cached compiled handlebars template collection
   *
   * @static
   * @memberof Templates
   */
  public static templates: unknown = {};

  /**
   * Returns compiled mail template. If it's not cached in collection it is read from file system.
   *
   * @static
   * @param templateDir
   * @param {string} templateName
   * @returns compiled mail template
   * @memberof Templates
   */
  public static getTemplate(templateDir: string, templateName: string) {
    templateDir = templateDir ?? (env.FORM_TEMPLATE_PATH || path.resolve(__dirname, '../templates'));
    if (!this.templates.hasOwnProperty(templateName)) {
      try {
        const html = fs.readFileSync(path.resolve(`${templateDir}/${templateName}.html`), 'utf8');
        this.templates[templateName] = handlebars.compile(html);
      } catch (err) {
        console.log(path.resolve(`./${templateName}.html`));
        console.log(err);
        throw new InternalServerErrorException('Could not find path');
      }
    }
    return this.templates[templateName];
  }
}
