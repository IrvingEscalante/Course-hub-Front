// Datos que se envían al backend al registrarse
export interface RegisterRequest {
  username:string;
  name: string;
  lastname:string;
  email: string;
  password: string;
}

export interface LoginResponse{
    access_token:string;
    token_type:string;
}

export interface RegisterData {
  id: number;
  email: string;
}

export interface VerifyEmailPayload {
  email: string;
  code: string;
}

export interface ResendCode{
  email: string;
}



export interface MessageResponse {
  success:boolean;
  message:string;
}
// Respuesta completa del backend al registrar
export interface RegisterResponse {
  id:number;
  name:string;
  email:string;
  username:string;
  lastname:string;
  photo:string;
  date_joined:Date;
  biography:string;
}
