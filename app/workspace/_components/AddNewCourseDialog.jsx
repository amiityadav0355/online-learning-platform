import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2Icon, Sparkle } from 'lucide-react'
import { description} from '@radix-ui/react-dialog'
import axios from 'axios'
import { v4 as uuidv4} from 'uuid';
import { useRouter } from 'next/navigation';


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function AddNewCourseDialog({ children }) {

  const [loading, setLoading]= useState(false);
  const [formData, setFormData] = useState({
    name:'',
    description:'',
    includeVideo:false,
    noOfChapters:1,
    category:'',
    level:''

    
  });

  const onHandleInputChange =(field,value)=>{
    setFormData(prev=>({
      ...prev,
      [field]:value
    }))
    console.log(formData);
  }  

  const router = useRouter();//////////////added

  const onGenerate= async() =>{

    console.log(formData);
    const courseId = uuidv4(); // ✅ generate unique course ID
    try{
    setLoading(true);
    const result = await axios.post('/api/generate-course-layout',{
      ...formData,
      courseId
    });
    console.log(result.data);
    router.push('/workspace/edit-course/'+result.data?.courseId);//redirect to banner page after success

    setLoading(false)
  }
  catch (e) {
    setLoading(false)
    console.log(e)
  }
  }
  return (
    <Dialog>
  <DialogTrigger asChild>{children}</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create New Course Using AI</DialogTitle>
      <DialogDescription asChild>
        <div className='flex flex-col gap-4 mt-3'>
            <div>
              <label>Course Name</label>
              <Input placeholder="Course Name"
               onChange={(event)=>onHandleInputChange('name',event?.target.value)}/>
            </div>
            <div>
              <label>Course Description (Optional)</label>
              <Textarea placeholder ="Course Description"
               onChange={(event)=>onHandleInputChange('description',event?.target.value)} />
            </div>
            <div>
              <label>No. Of Chapters</label>
              <Input placeholder="No of Chapters"
               onChange={(event)=>onHandleInputChange('noOfChapters',Number(event?.target.value))}type='number'/>
            </div>
            <div className='flex gap-3 item-center'>
              <label>Include Video</label>
              <Switch 
              onCheckedChange={()=>onHandleInputChange('includeVideo',!formData?.includeVideo)}/>
            </div>
            <div>
              <label className=''>Difficulty Level</label>
              <Select onValueChange={(value)=>onHandleInputChange('level',value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Difficulty Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="begineer">Begineer</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="advanced">Advance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label>Category</label>
              <Input placeholder="Category (Separated by Comma)"
               onChange={(event)=>onHandleInputChange('category',event?.target.value)}/>
            </div>
            <div className='mt-5 '>
              <Button className={'w-full'} onClick={onGenerate} disabled={loading}>
                {loading?<Loader2Icon className='animate-spin' />: <Sparkle/>}Generate Course</Button>
            </div>
        </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
  )
}

export default AddNewCourseDialog
