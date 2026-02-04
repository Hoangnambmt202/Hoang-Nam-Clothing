import { Module } from '@nestjs/common';
import { PaymentTransactionsModule } from './payment_transactions/payment_transactions.module';

@Module({
  imports: [PaymentTransactionsModule]
})
export class PaymentsModule {}
