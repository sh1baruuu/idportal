import { LoaderCircle } from "lucide-react"

const ApplicantSpinner = () => {
  return (
    <div className='flex items-center justify-center h-[80vh]'><LoaderCircle className='animate-spin' /></div>
  )
}

export default ApplicantSpinner