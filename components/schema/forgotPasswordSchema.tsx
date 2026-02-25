import {z} from "zod";

const forgotPasswordSchema = z.object(
    {
        email:z.email()
    }
);

export default forgotPasswordSchema;