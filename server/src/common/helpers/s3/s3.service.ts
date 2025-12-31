import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';

interface DownloadS3 {
  arquivo: any;
  tipo: string;
}

@Injectable()
export class S3Service {
  private S3_ACCESS_KEY_ID: string;
  private S3_SECRET_ACCESS_KEY: string;
  private S3_AWS_REGION: string;
  private S3_BUCKET_NAME: string;


  constructor() {
    this.S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
    this.S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
    this.S3_AWS_REGION = process.env.S3_AWS_REGION;
    this.S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
  }
  /**
   * @author João Zupeli
   *
   * @description Gera a instância do S3
   *
   * @memberof S3Service
   */
  private s3(): S3Client {
    const s3 = new S3Client({
      region: this.S3_AWS_REGION,
      credentials: {
        accessKeyId: this.S3_ACCESS_KEY_ID,
        secretAccessKey: this.S3_SECRET_ACCESS_KEY,
      },
    });

    return s3;
  }

  /**
   * @author João Zupeli
   *
   * @description Efetua o upload do arquivo para o S3
   *
   * @param {Express.Multer.File} arquivo
   * @param {string} diretorio
   *
   * @memberof S3Service
   */
  async upload(arquivo: Express.Multer.File, diretorio: string) {
    const extensao = arquivo.mimetype.split('/')[1];

    if (!process.env.S3_EXTENSION_FILE?.split(',').includes(extensao.toLowerCase())) {
      throw new Error('Extensão de arquivo inválida!');
    }

    if (arquivo.size / 1024 / 1024 > Number(process.env.S3_MAX_SIZE)) {
      throw new Error('Tamanho do arquivo não suportado!');
    }

    const nome = `${ulid()}.${extensao}`;

    const s3 = await this.s3().send(
      new PutObjectCommand({
        Bucket: this.S3_BUCKET_NAME,
        Key: `${diretorio}/${nome}`,
        Body: arquivo.buffer,
        ContentType: arquivo.mimetype,
        ACL: 'private',
      })
    );

    return { s3, nome };
  }

  /**
   * @author João Zupeli
   *
   * @description Efetua o download do arquivo no S3
   *
   * @param {string} arquivo
   *
   * @memberof S3Service
   */
  async download(arquivo: string): Promise<DownloadS3> {
    const s3 = await this.s3().send(
      new GetObjectCommand({
        Bucket: this.S3_BUCKET_NAME,
        Key: arquivo,
      })
    );

    if (!s3.Body) {
      throw new Error('Arquivo não encontrado!');
    }

    return {
      arquivo: Buffer.from(await s3.Body.transformToByteArray()),
      tipo: s3.Metadata?.['content-type'] || s3.ContentType || '',
    };
  }
}
