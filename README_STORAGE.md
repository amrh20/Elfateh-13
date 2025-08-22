# نظام السلة والمفضلة باستخدام localStorage

## نظرة عامة

تم تطوير نظام متكامل لإدارة سلة التسوق وقائمة المفضلة باستخدام localStorage بشكل احترافي. النظام يوفر:

- ✅ إدارة كاملة للسلة والمفضلة
- ✅ حفظ البيانات تلقائياً في localStorage
- ✅ معالجة الأخطاء والتحقق من صحة البيانات
- ✅ إدارة مساحة التخزين
- ✅ نظام إشعارات متقدم
- ✅ دعم استيراد وتصدير البيانات
- ✅ هجرة البيانات من النسخ القديمة

## المكونات الرئيسية

### 1. CartService
إدارة سلة التسوق مع دعم:
- إضافة/إزالة المنتجات
- تحديث الكميات
- حساب المجموع
- حفظ البيانات في localStorage

### 2. WishlistService
إدارة قائمة المفضلة مع دعم:
- إضافة/إزالة المنتجات
- البحث والتصفية
- نقل المنتجات للسلة
- حفظ البيانات في localStorage

### 3. StorageService
إدارة عامة للتخزين مع دعم:
- التحقق من توفر localStorage
- إدارة مساحة التخزين
- هجرة البيانات
- استيراد/تصدير البيانات

### 4. NotificationService
نظام إشعارات متقدم مع دعم:
- رسائل النجاح والخطأ
- إشعارات تلقائية
- حفظ الإشعارات
- واجهة مستخدم جميلة

## كيفية الاستخدام

### إضافة منتج للسلة

```typescript
// في المكون
constructor(private cartService: CartService) {}

addToCart(product: Product): void {
  const result = this.cartService.addToCart(product, 2); // كمية = 2
  
  if (result.success) {
    console.log('تم الإضافة:', result.message);
  } else {
    console.error('فشل الإضافة:', result.message);
  }
}
```

### إضافة منتج للمفضلة

```typescript
// في المكون
constructor(private wishlistService: WishlistService) {}

addToWishlist(product: Product): void {
  const result = this.wishlistService.addToWishlist(product);
  
  if (result.success) {
    console.log('تم الإضافة:', result.message);
  } else {
    console.error('فشل الإضافة:', result.message);
  }
}
```

### عرض الإشعارات

```typescript
// في المكون
constructor(private notificationService: NotificationService) {}

// إشعار نجاح
this.notificationService.success('تم الإضافة', 'تم إضافة المنتج بنجاح');

// إشعار خطأ
this.notificationService.error('خطأ', 'فشل في إضافة المنتج');

// إشعار تلقائي لنتيجة العملية
this.notificationService.showCartResult(result);
```

## الميزات المتقدمة

### 1. إدارة مساحة التخزين

```typescript
// الحصول على معلومات التخزين
const storageInfo = this.storageService.getStorageInfo();
console.log('المساحة المستخدمة:', storageInfo.used);
console.log('النسبة المئوية:', storageInfo.percentage);

// تصدير البيانات
const exportData = this.storageService.exportStorageData();

// استيراد البيانات
const result = this.storageService.importStorageData(jsonData);
```

### 2. هجرة البيانات

```typescript
// هجرة البيانات من النسخ القديمة
this.cartService.migrateFromOldStorage();
this.wishlistService.migrateFromOldStorage();
```

### 3. البحث والتصفية

```typescript
// البحث في المفضلة
const searchResults = this.wishlistService.searchInWishlist('لابتوب');

// تصفية حسب الصنف
const categoryProducts = this.wishlistService.getProductsByCategory('إلكترونيات');

// تصفية حسب العلامة التجارية
const brandProducts = this.wishlistService.getProductsByBrand('Apple');
```

## إعداد النظام

### 1. إضافة المكونات للـ App

```typescript
// في app.component.ts
import { NotificationToastComponent } from './components/notification-toast/notification-toast.component';

@Component({
  imports: [NotificationToastComponent],
  template: `
    <app-notification-toast></app-notification-toast>
    <!-- باقي المحتوى -->
  `
})
```

### 2. تهيئة الخدمات

```typescript
// في app.config.ts
import { provideLocalStorage } from './services/storage.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideLocalStorage(),
    // باقي الخدمات
  ]
};
```

## معالجة الأخطاء

### 1. التحقق من توفر localStorage

```typescript
if (this.storageService.isLocalStorageAvailable()) {
  // localStorage متاح
} else {
  // localStorage غير متاح
  console.warn('localStorage غير متاح، سيتم استخدام الذاكرة المؤقتة');
}
```

### 2. معالجة أخطاء التخزين

```typescript
try {
  const result = this.cartService.addToCart(product);
  // معالجة النتيجة
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    // مساحة التخزين ممتلئة
    this.handleStorageQuotaExceeded();
  }
}
```

## أفضل الممارسات

### 1. حفظ البيانات

```typescript
// حفظ البيانات تلقائياً
this.cartService.addToCart(product); // يتم الحفظ تلقائياً

// حفظ البيانات يدوياً (إذا لزم الأمر)
this.cartService.saveCartToStorage();
```

### 2. استرجاع البيانات

```typescript
// الاشتراك في التغييرات
this.cartService.getCartItems().subscribe(items => {
  this.cartItems = items;
});

// الحصول على القيمة الحالية
this.cartItems = this.cartService.getCartItemsValue();
```

### 3. إدارة الذاكرة

```typescript
// تنظيف الذاكرة عند تدمير المكون
ngOnDestroy(): void {
  this.subscription.unsubscribe();
}
```

## استكشاف الأخطاء

### 1. مشاكل localStorage

```typescript
// التحقق من توفر localStorage
console.log('localStorage متاح:', this.storageService.isLocalStorageAvailable());

// التحقق من مساحة التخزين
const info = this.storageService.getStorageInfo();
console.log('معلومات التخزين:', info);
```

### 2. مشاكل البيانات

```typescript
// التحقق من صحة البيانات
const cartItems = this.cartService.getCartItemsValue();
console.log('عناصر السلة:', cartItems);

// تنظيف البيانات الفاسدة
this.cartService.clearCart();
```

### 3. مشاكل الأداء

```typescript
// مراقبة حجم البيانات
const stats = this.storageService.getStorageStats();
console.log('إحصائيات التخزين:', stats);

// تنظيف البيانات القديمة
this.storageService.cleanupExpiredData();
```

## التخصيص

### 1. تغيير مفاتيح التخزين

```typescript
// في الخدمات
private readonly STORAGE_KEY = 'my_app_cart';
private readonly STORAGE_KEY = 'my_app_wishlist';
```

### 2. تغيير حدود التخزين

```typescript
// في StorageService
private readonly MAX_STORAGE_SIZE = 10 * 1024 * 1024; // 10MB

// في CartService
private readonly MAX_CART_ITEMS = 500;

// في WishlistService
private readonly MAX_WISHLIST_ITEMS = 1000;
```

### 3. تخصيص الإشعارات

```typescript
// تخصيص مدة الإشعار
this.notificationService.success('العنوان', 'الرسالة', { duration: 10000 });

// تخصيص موضع الإشعار
this.notificationService.success('العنوان', 'الرسالة', { position: 'bottom-center' });
```

## الدعم والمساعدة

إذا واجهت أي مشاكل أو لديك أسئلة:

1. تحقق من console المتصفح للأخطاء
2. تأكد من توفر localStorage
3. تحقق من مساحة التخزين المتاحة
4. راجع إعدادات المتصفح

## التطوير المستقبلي

الميزات المخطط إضافتها:

- [ ] دعم IndexedDB للتخزين الكبير
- [ ] مزامنة البيانات مع الخادم
- [ ] دعم التخزين المشفر
- [ ] نظام النسخ الاحتياطي التلقائي
- [ ] دعم العملات المتعددة
- [ ] نظام التقييمات والمراجعات

---

**ملاحظة**: هذا النظام مصمم للعمل بدون خادم خلفي، لكن يمكن دمجه بسهولة مع API عند الحاجة.
