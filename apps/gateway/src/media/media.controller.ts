import { Auth } from '@app/common/decorators/auth.decorator'
import { UserRole } from '@app/contracts/users/user.dto'
import { BadRequestException, Controller, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { MediaService } from './media.service'
import { ImageFileValidationPipe } from './pipes/file.validation.pipe'

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) { }

  @Auth(UserRole.USER)
  @Post('upload/:key')
  @UseInterceptors(FilesInterceptor('files', 5))
  public async upload(
    @Param('key') key: string,
    @UploadedFiles(new ImageFileValidationPipe ()) files: Express.Multer.File[] | Express.Multer.File
  ) {
    if(!key) throw new BadRequestException('Please enter key.')
    
    const decodedKey = key.replace(/-/g, '/')

    return this.mediaService.upload(decodedKey, files)
  }
}
