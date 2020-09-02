import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CpfValidator } from '../validators/cpf.validator';
import { ComparacaoValidator } from '../validators/comparacao-validator';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  public formLogin: FormGroup;

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
    DataDeNascimento: [
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
  
  constructor(private formBuilder: FormBuilder) {
    this.formLogin = formBuilder.group({
      nome: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      cpf: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.maxLength(14), CpfValidator.cpfValido])],
      DataDeNascimento: ['', Validators.compose([Validators.required])],
      genero: ['', Validators.compose([Validators.required])],
      celular: ['', Validators.compose([ Validators.minLength(10), Validators.maxLength(16)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      senha: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmarSenha: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    }, {
      validators: ComparacaoValidator('senha','confirmaSenha')
    });
   
   }

  ngOnInit() {
  }

  public login() {
    if(this.formLogin.valid) {
    console.log('formulario válido!');
    } else {
      console.log('formulário inválido.')
    }
    }
 
  }


