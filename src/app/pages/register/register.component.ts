import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  message = '';
  messageType: 'success' | 'error' = 'error';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, this.emailOrPhoneValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  emailOrPhoneValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }

    const value = control.value.trim();
    
    // Email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Phone validation regex (Egyptian phone numbers and international formats)
    const phoneRegex = /^(\+?2)?01[0-9]{9}$|^\+?[1-9]\d{1,14}$/;
    
    const isValidEmail = emailRegex.test(value);
    const isValidPhone = phoneRegex.test(value);
    
    if (!isValidEmail && !isValidPhone) {
      return { invalidEmailOrPhone: true };
    }
    
    return null;
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      // Remove the passwordMismatch error if passwords match
      if (confirmPassword.errors) {
        delete confirmPassword.errors['passwordMismatch'];
        if (Object.keys(confirmPassword.errors).length === 0) {
          confirmPassword.setErrors(null);
        }
      }
      return null;
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  isEmail(value: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value.trim());
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.message = '';

    try {
      const formData = this.registerForm.value;
      
      // تحديد ما إذا كان المدخل email أو phone
      const emailOrPhone = formData.email.trim();
      const isEmailInput = this.isEmail(emailOrPhone);
      
      // إعداد البيانات للـ API
      const registerData: any = {
        username: formData.username,
        password: formData.password
      };
      
      // إضافة email أو phone حسب نوع المدخل
      if (isEmailInput) {
        registerData.email = emailOrPhone;
      } else {
        registerData.phone = emailOrPhone;
      }
      
      // استدعاء الـ API
      const response = await this.http.post(`${environment.apiUrl}/signup`, registerData).toPromise();
      
      console.log('Registration successful:', response);
      
      this.message = 'تم إنشاء الحساب بنجاح!';
      this.messageType = 'success';
      
      this.notificationService.showSuccess('تم إنشاء الحساب بنجاح');
      
      // التوجه لصفحة تسجيل الدخول
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
      
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = 'حدث خطأ في إنشاء الحساب. يرجى المحاولة مرة أخرى.';
      
      if (error.status === 400) {
        errorMessage = 'البيانات المدخلة غير صحيحة. يرجى التحقق من المعلومات.';
      } else if (error.status === 409) {
        errorMessage = 'هذا البريد الإلكتروني أو اسم المستخدم مستخدم بالفعل.';
      } else if (error.status === 422) {
        errorMessage = 'البيانات غير مكتملة أو غير صحيحة.';
      }
      
      this.message = errorMessage;
      this.messageType = 'error';
      this.notificationService.showError('فشل في إنشاء الحساب');
    } finally {
      this.isLoading = false;
    }
  }
}
