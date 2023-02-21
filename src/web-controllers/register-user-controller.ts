import { UserData } from "@/entities"
import { HttpRequest, HttpResponse } from "@/web-controllers/ports"
import { MissingParamError } from "@/web-controllers/erros"
import { created, badRequest, serverError } from "@/web-controllers/util"
import { UseCase } from "@/usecases/ports"

export class RegisterUserController {
    private readonly usecase: UseCase

    constructor(usecase: UseCase){
    	this.usecase = usecase
    }

    public async handle(request: HttpRequest): Promise<HttpResponse> {
    	try {

    		const requiredParams = ["name", "email"]
    		const missingParams = requiredParams.filter((paramName) => !request.body[paramName])
    		if (missingParams.length) {
    			return badRequest(new MissingParamError(missingParams.join(", ")))
    		}
            
    		const userData: UserData = request.body
    		const response = await this.usecase.perform(userData)
    
    		if(response.isLeft()) {
    			return badRequest(response.value)
    		}
    
    		
    		return created(response.value)
    		
    	} catch(error) {
    		return serverError(error)
    	}
    }

}