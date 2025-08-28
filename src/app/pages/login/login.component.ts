import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  showPassword = false;
  message = '';
  messageType: 'success' | 'error' = 'error';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.message = '';

    try {
      const formData = this.loginForm.value;
      
      // محاكاة API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // هنا يتم استدعاء الـ API الفعلي
      console.log('Login data:', formData);
      
      this.message = 'تم تسجيل الدخول بنجاح!';
      this.messageType = 'success';
      
      this.notificationService.showSuccess('تم تسجيل الدخول بنجاح');
      
      // التوجه للصفحة الرئيسية أو الصفحة المطلوبة
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1500);
      
    } catch (error) {
      this.message = 'حدث خطأ في تسجيل الدخول. يرجى المحاولة مرة أخرى.';
      this.messageType = 'error';
      this.notificationService.showError('فشل في تسجيل الدخول');
    } finally {
      this.isLoading = false;
    }
  }
}