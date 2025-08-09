import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <!-- Background Decorative Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-red-100 rounded-full opacity-20 animate-float"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-red-200 rounded-full opacity-20 animate-float" style="animation-delay: 2s;"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-red-100 to-red-200 rounded-full opacity-10 animate-pulse"></div>
      </div>

      <div class="max-w-md w-full space-y-8 relative z-10">
        <!-- Login Card -->
        <div class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <!-- Header -->
          <div class="text-center mb-8">
            <div class="mx-auto h-20 w-20 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl flex items-center justify-center shadow-lg mb-6 transform hover:scale-105 transition-transform duration-300">
              <svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
                </path>
              </svg>
            </div>
            <h2 class="text-3xl font-bold text-gray-800 mb-2">
              تسجيل الدخول
            </h2>
            <p class="text-gray-600">
              مرحباً بك في
              <span class="text-red-600 font-semibold">الفتح للأدوات المنزلية</span>
            </p>
            <p class="mt-4 text-sm text-gray-500">
              ليس لديك حساب؟
              <a routerLink="/register" class="font-semibold text-red-600 hover:text-red-700 transition-colors duration-300">
                إنشاء حساب جديد
              </a>
            </p>
          </div>
          
          <!-- Login Form -->
          <form class="space-y-6" (ngSubmit)="onSubmit()">
            <!-- Email/Phone Input -->
            <div class="space-y-2">
              <label for="identifier" class="block text-sm font-semibold text-gray-700">
                رقم الموبايل أو البريد الإلكتروني
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207">
                    </path>
                  </svg>
                </div>
                <input id="identifier" 
                       name="identifier" 
                       type="text" 
                       [(ngModel)]="identifier"
                       required 
                       class="w-full pr-10 pl-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                       placeholder="أدخل رقم الموبايل أو البريد الإلكتروني">
              </div>
            </div>

            <!-- Password Input -->
            <div class="space-y-2">
              <label for="password" class="block text-sm font-semibold text-gray-700">
                كلمة المرور
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z">
                    </path>
                  </svg>
                </div>
                <input id="password" 
                       name="password" 
                       type="password" 
                       [(ngModel)]="password"
                       required 
                       class="w-full pr-10 pl-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                       placeholder="أدخل كلمة المرور">
              </div>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input id="remember-me" 
                       name="remember-me" 
                       type="checkbox" 
                       [(ngModel)]="rememberMe"
                       class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded transition-all duration-300">
                <label for="remember-me" class="mr-2 block text-sm text-gray-700 font-medium">
                  تذكرني
                </label>
              </div>

              <div class="text-sm">
                <a href="#" class="font-semibold text-red-600 hover:text-red-700 transition-colors duration-300">
                  نسيت كلمة المرور؟
                </a>
              </div>
            </div>

            <!-- Login Button -->
            <div>
              <button type="submit" 
                      [disabled]="isLoading"
                      class="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                <span *ngIf="isLoading" class="absolute left-0 inset-y-0 flex items-center pr-3">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                {{ isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول' }}
              </button>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" 
                 class="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2 space-x-reverse">
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                </path>
              </svg>
              <span class="text-sm font-medium">{{ errorMessage }}</span>
            </div>
          </form>

          <!-- Social Login Divider -->
          <div class="mt-8">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-white text-gray-500 font-medium">أو</span>
              </div>
            </div>

            <!-- Social Login Buttons -->
            <div class="mt-6 grid grid-cols-2 gap-4">
              <!-- Google Button -->
              <button class="w-full inline-flex justify-center items-center py-3 px-4 border-2 border-gray-200 rounded-xl shadow-sm bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform hover:scale-105">
                <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google</span>
              </button>

              <!-- Facebook Button -->
              <button class="w-full inline-flex justify-center items-center py-3 px-4 border-2 border-gray-200 rounded-xl shadow-sm bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform hover:scale-105">
                <svg class="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center">
          <p class="text-sm text-gray-500">
            بالدخول، أنت توافق على
            <a href="#" class="text-red-600 hover:text-red-700 font-medium">شروط الاستخدام</a>
            و
            <a href="#" class="text-red-600 hover:text-red-700 font-medium">سياسة الخصوصية</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    
    @keyframes float {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-20px);
      }
    }
  `]
})
export class LoginComponent {
  identifier: string = '';
  password: string = '';
  rememberMe: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  onSubmit(): void {
    if (!this.identifier || !this.password) {
      this.errorMessage = 'يرجى ملء جميع الحقول المطلوبة';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Simulate API call
    setTimeout(() => {
      // Here you would typically make an API call to authenticate
      if (this.identifier === 'test@example.com' && this.password === 'password') {
        // Successful login
        console.log('Login successful');
        // Navigate to home or dashboard
      } else {
        this.errorMessage = 'بيانات الدخول غير صحيحة';
      }
      this.isLoading = false;
    }, 1000);
  }
} 