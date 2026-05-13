import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from 'next/image';
// import GoogleIcon from 'google'

const LoginPage = () => {
  return (
    <div className="w-[350px] m-auto mt-[200px]">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className='text-lg font-bold'>Login to your account</CardTitle>
          <CardDescription className='font-bold'>
            Your Go-To Blog App
          </CardDescription>
          <CardAction>
            <Button variant="link">Sign Up</Button>
          </CardAction>
        </CardHeader>
        {/* <CardContent>
          <Button>
            Login with Google
          </Button>
        </CardContent> */}
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Login with Google 
            <Image 
              className='w-6 h-6'
              width={6}
              height={6}
              alt='Google Icon'
              src={'/google-icon.svg'} 
              />
          </Button>
          {/* <Button variant="outline" className="w-full">
            Login with Google
          </Button> */}
        </CardFooter>
      </Card>
    </div>
  )
}

export default LoginPage;