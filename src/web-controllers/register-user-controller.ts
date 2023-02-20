import { UserData } from "@/entities"
import { RegisterUserOnMailingList } from "@/usecases/register-user-on-mailing-list"
import { HttpRequest, HttpResponse } from "./ports"
import { MissingParamError } from "./ports/erros"
import { created, badRequest } from "./util"

export class RegisterUserController {
    private readonly usecase: RegisterUserOnMailingList

    constructor(usecase: RegisterUserOnMailingList){
    	this.usecase = usecase
    }

    public async handle(request: HttpRequest): Promise<HttpResponse> {

    	const missingParams = []
    	if(!request.body.name) {
    		missingParams.push("name")
    	}
    	if(!request.body.email) {
    		missingParams.push("email")
    	}
        
    	if(missingParams.length) {
    		return badRequest(new MissingParamError(missingParams.join(", ")))
    	}
        
    	const userData: UserData = request.body
    	const response = await this.usecase.registerUserOnMailingList(userData)

    	if(response.isLeft()) {
    		return badRequest(response.value)
    	}

    	if(response.isRight()) {
    		return created(response.value)
    	}
    }

}