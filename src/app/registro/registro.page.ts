import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CpfValidator } from '../validators/cpf.validator';
import { ComparacaoValidator } from '../validators/comparacao-validator';
import { UsuariosService } from '../services/usuarios.service';
import { AlertController } from '@ionic/angular';
import { Usuario } from '../models/Usuario';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  public formRegistro: FormGroup;

  public mensagens_validacao = {
    nome: [
      {tipo: 'required', mensagem: 'O campo Nome é obrigatório!'},
      {tipo: 'minlength', mensagem: 'O nome deve ter pelo menos 3 letras!'}
    ],
    cpf: [
      {tipo: 'required', mensagem: 'O campo CPF é obrigatório!' },
      {tipo: 'minlength', mensagem: 'O CPF deve ter no mínimo 11 números!'},
      {tipo: 'maxlength', mensagem: 'O CPF deve ter no máximo 14 números!'},
      {tipo: 'invalido', mensagem: 'CPF inválido!'}
    ],
    dataNascimento: [
      {tipo: 'required', mensagem: 'O campo de Data é obrigatório!' },
    ],
    genero: [
      {tipo: 'required', mensagem: 'O campo Gênero é obrigatório!' },
    ],
    celular: [
      {tipo: 'required', mensagem: 'O campo Celular é obrigatório!' },
      {tipo: 'maxlength', mensagem: 'O deve ter no máximo 16 números!' },
    ],
    email: [
      {tipo: 'required', mensagem: 'O campo E-mail é obrigatório! '},
      {tipo: 'email', mensagem: 'E-mail inválido! '}
    ],
    senha: [
      {tipo: 'required', mensagem: 'O campo senha é obrigatório! '},
      {tipo: 'minlength', mensagem: 'A senha deve ter no míinimo 6 caracteres! '}
    ],
    confirmarSenha: [
      {tipo: 'required', mensagem: 'O campo Confirmar Senha é obrigatório! '},
      {tipo: 'minlength', mensagem: 'A senha deve ter no míinimo 6 caracteres! '},
      {tipo: 'comparacao', mensagem: 'Deve ser igual a Senhas! '}
    ]
  };
  
  constructor(
    private formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    public alertController: AlertController,
    public router: Router
    ) {

    this.formRegistro = formBuilder.group({
      nome: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      cpf: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(14), CpfValidator.cpfValido])],
      dataNascimento: ['', Validators.compose([Validators.required])],
      genero: ['', Validators.compose([Validators.required])],
      celular: ['', Validators.compose([ Validators.minLength(10), Validators.maxLength(16)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      senha: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmarSenha: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    }, {
      validators: ComparacaoValidator('senha','confirmaSenha')
    });
   
   }

  async ngOnInit() {
    await this.usuariosService.buscarTodos();
    console.log(this.usuariosService.listarUsuarios);
  }
    
  public async salvarFormulario(){
    if(this.formRegistro.valid) {

      let usuario = new Usuario();
      usuario.nome = this.formRegistro.value.nome;
      usuario.cpf = this.formRegistro.value.cpf;
      usuario.dataNascimento = new Date(this.formRegistro.value.dataNascimento);
      usuario.genero = this.formRegistro.value.genero;
      usuario.celular = this.formRegistro.value.celular;
      usuario.email = this.formRegistro.value.email;
      usuario.senha = this.formRegistro.value.senha;

      if(await this.usuariosService.salvar(usuario)){
      this.exibirAlerta('SUCESSO!', 'Usuário salvo com sucesso!');
      this.router.navigateByUrl('/login');
      }else{
        this.exibirAlerta('ERRO!', 'Erro ao salvar usuário!');
      }

    }else{
      this.exibirAlerta('ADVERTENCIA', 'Formulário inválido<br/>Verifique os campos do seu formulário!');
    }
  }

  async exibirAlerta(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });

 
    await alert.present();
  }

}
