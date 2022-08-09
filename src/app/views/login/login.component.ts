import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/login';
import { LoginService } from 'src/app/services/loginService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {

  Login: Login = {username: "", password: ""};
  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.Submit();
  }

  Submit(){
    this.loginService.Login();
    this.router.navigate(['/dashboard']);
  }
}
