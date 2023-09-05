import {PassportStrategy} from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Usuario } from 'src/core/domain/entity/collections/usuario.collection';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import {UnauthorizedException, Injectable} from '@nestjs/common'


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(
        @InjectModel(Usuario.name) private usuarioRepository: Model<Usuario>,
        configService:ConfigService
    ){
        super({
            secretOrKey:configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload:JwtPayload):Promise<Usuario>{
        
        
        
        const {_id} = payload;
      
        const user = await this.usuarioRepository.findById(_id)
        
        if(!user)
         throw new UnauthorizedException('Token no valido')

        if(user.esEliminado)
            throw new UnauthorizedException('Usuario esta inactivo, habla con un admin')
        
        return user ;
    }

}