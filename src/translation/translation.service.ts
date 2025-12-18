import { Injectable } from '@nestjs/common';
import { v2 } from '@google-cloud/translate';

@Injectable()
export class TranslationService {
  private translator: v2.Translate;

  constructor() {
    this.translator = new v2.Translate({
      projectId: process.env.GOOGLE_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
  }

  async translateText(text: string, target: string) {
    const [translation] = await this.translator.translate(text, target);
    return translation;
  }
}
