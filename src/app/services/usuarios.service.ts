import { Injectable } from '@angular/core';
import { ArmazenamentoService } from './armazenamento.service';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  public listarUsuarios = [];


  constructor(private armazenamentoService: ArmazenamentoService) { }

  public async buscarTodos() {
    this.listarUsuarios = await this.armazenamentoService.pegarDados('usuarios');

    if(!this.listarUsuarios){
      this.listarUsuarios = [];
    }
  }

  public async salvar(usuario: Usuario) {
    await this.buscarTodos();

    if(!usuario) {
      return false;
    }

  if(!this.listarUsuarios) {
    this.listarUsuarios = [];
  }

  this.listarUsuarios.push(usuario);

  return await this.armazenamentoService.salvarDados('usuarios',this.listarUsuarios);
  } 
}
