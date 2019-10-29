import { Module, OnModuleInit } from '@nestjs/common';
import { FileModule } from './file';
import { PasswordModule, PasswordService } from './password';

@Module({
	imports: [FileModule, PasswordModule],
})
export class AppModule implements OnModuleInit {
	constructor(private passwdSvc: PasswordService) {}

	onModuleInit() {
		this.passwdSvc.execSingle(
			'blackbox.localAdministrator:500:AAD3B435B51404EEAAD3B435B51404EE:AB987CB169FB0FA623417DEBC88B9750:Disabled=False,Expired=False,PasswordNeverExpires=True,PasswordNotRequired=False,PasswordLastChanged=201910211025,LastLogonTimestamp=160101010000,IsAdministrator=True,IsDomainAdmin=True,IsEnterpriseAdmin=True::',
		);
	}
}
