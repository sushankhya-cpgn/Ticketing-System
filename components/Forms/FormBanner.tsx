
interface FormBannerProps{
    label?:string;
    height?: string | null;
    width?: string | null;
}


function FormBanner({label="Insurance Policy Management",height=null,width=null}:FormBannerProps){
    return(
        <div className={` bg-blue-900 text-white   h-${height} w-${width}` }>
        <h1 className="text-center p-4 text-3xl font-bold h-full">{label}</h1>
        </div>
    );
}


export default FormBanner;