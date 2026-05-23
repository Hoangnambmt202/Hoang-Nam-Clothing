import { Module } from '@nestjs/common';
import { PaymentTransactionsModule } from './payment_transactions/payment_transactions.module';
import { PaymentMethodsModule } from './payment_methods/payment_methods.module';

@Module({
  imports: [PaymentTransactionsModule, PaymentMethodsModule]
})
export class PaymentsModule {}
