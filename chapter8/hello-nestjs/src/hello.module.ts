import {Module} from "@nestjs/common";
import {HelloController} from "./hello.controller";

// @ts-ignore
@Module({
    controllers: [HelloController],
    
})

export class HelloModule {}