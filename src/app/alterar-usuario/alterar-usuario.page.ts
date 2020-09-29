import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Usuario } from '../models/Usuario';
import { UsuariosService } from '../services/usuarios.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CpfValidator } from '../validators/cpf.validator';

@Component({
  selector: 'app-alterar-usuario',
  templateUrl: './alterar-usuario.page.html',
  styleUrls: ['./alterar-usuario.page.scss'],
})
export class AlterarUsuarioPage implements OnInit {

  public formAlterar: FormGroup;

  public mensagens_validacao = {
    nome: [
      { tipo: 'required', mensagem: 'O campo Nome é obrigatório!' },
      { tipo: 'minlength', mensagem: 'O nome deve ter pelo menos 3 letras!' }
    ],
    cpf: [
      { tipo: 'required', mensagem: 'O campo CPF é obrigatório!' },
      { tipo: 'minlength', mensagem: 'O CPF deve ter no mínimo 11 números!' },
      { tipo: 'maxlength', mensagem: 'O CPF deve ter no máximo 14 números!' },
      { tipo: 'invalido', mensagem: 'CPF inválido!' }
    ],
    dataNascimento: [
      { tipo: 'required', mensagem: 'O campo de Data é obrigatório!' },
    ],
    genero: [
      { tipo: 'required', mensagem: 'O campo Gênero é obrigatório!' },
    ],
    celular: [
      { tipo: 'required', mensagem: 'O campo Celular é obrigatório!' },
      { tipo: 'maxlength', mensagem: 'O deve ter no máximo 16 números!' },
    ],
    email: [
      { tipo: 'required', mensagem: 'O campo E-mail é obrigatório! ' },
      { tipo: 'email', mensagem: 'E-mail inválido! ' }
    ]
  };

  private usuario: Usuario;

  private manterLogadoTemp: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    public alertController: AlertController,
    public router: Router
  ) {
    this.formAlterar = formBuilder.group({
      nome: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      cpf: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(14), CpfValidator.cpfValido])],
      dataNascimento: ['', Validators.compose([Validators.required])],
      genero: ['', Validators.compose([Validators.required])],
      celular: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(16)])],
      email: ['', Validators.compose([Validators.required, Validators.email])]
    });

    this.preencherFormulario();

  }

  ngOnInit() {
  }

  public async preencherFormulario() {
    this.usuario = await this.usuariosService.buscarUsuarioLogado();
    this.manterLogadoTemp = this.usuario.manterLogado;
    delete this.usuario.manterLogado;

    this.formAlterar.setValue(this.usuario);
    this.formAlterar.patchValue({ dataNascimento: this.usuario.dataNascimento.toISOString() });
  }

  public async salvar() {
    if (this.formAlterar.valid) {
      this.usuario.nome = this.formAlterar.value.nome;
      this.usuario.dataNascimento = new Date(this.formAlterar.value.dataNascimento);
      this.usuario.genero = this.formAlterar.value.genero;
      this.usuario.celular = this.formAlterar.value.celular;
      this.usuario.email = this.formAlterar.value.email;

      if(await this.usuariosService.alterar(this.usuario)) {
        this.usuario.manterLogado = this.manterLogadoTemp;
        this.usuariosService.salvarUsuarioLogado(this.usuario);
        this.exibirAlerta("SUCESSO!", "Usuário alterado com sucesso!");
        this.router.navigateByUrl('/configuracoes');
      }

    } else {
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