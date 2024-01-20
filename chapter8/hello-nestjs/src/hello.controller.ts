import {Controller, Get} from "@nestjs/common";


// @ts-ignore
@Controller()
export class HelloController {

    // @ts-ignore
    @Get()
    hello() {
        return "안녕하세요! NESTJS로 만든 첫 애플리케이션입니다."
    }
}

