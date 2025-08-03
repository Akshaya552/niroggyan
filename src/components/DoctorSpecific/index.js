import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { RxCross1 } from "react-icons/rx";
import Popup from 'reactjs-popup'
import 'reactjs-popup/dist/index.css'
import { useParams } from 'react-router-dom';
import './index.css';


const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}; 

const DoctorSpecific = () => {
  const [doctor, setDoctor] = useState([]);
  const [schedule,setSchedule] = useState([]);
  const [activeState, setActiveState] = useState(apiStatusConstants.initial);
  const [patientName, setPatientName] = useState('');
  const [email, setEmail] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [submitStatus,setSubmitStatus] = useState(false)

  const { id } = useParams();


  useEffect(() => {
    setActiveState(apiStatusConstants.inProgress)
    
        const doctorFetching = async()=>{
            const response = await fetch(`https://niroggyan-1-lm22.onrender.com/doctors/${id}`)
            if (response.ok===true){
                const docto = await response.json();
                setDoctor(docto.doctorSpecific);
                setSchedule(docto.schedule)
                setActiveState(apiStatusConstants.success)
            }else{
                setActiveState(apiStatusConstants.failure)
            }
        }
        doctorFetching()
  }, []);

  const renderLoadingView = () => (
      <div className="loader-container">
        <ClipLoader color="#0b69ff" size={50} />
      </div>
    );
    
    const renderFailureView = () => (
      <div className="loader-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="error view"
          className="job-image"
        />
        <h1 className="failure-text">Something Went Wrong</h1>
      </div>
    );

    const csscolor = ()=>{
        if (doctor.availability_status==='Available Today'){
            return 'available-success'
        }else if (doctor.availability_status==='Fully Booked'){
            return 'not-available'
        }else{
            return 'leave'
        }
    }

    const doctor_available = csscolor();

    const daysOfWeek = [
    "Sunday",    
    "Monday",   
    "Tuesday",   
    "Wednesday", 
    "Thursday",  
    "Friday",    
    "Saturday"   
    ];

    const onFormSubmitted = ()=>{
        if (patientName!=='' && email!=='' && dateTime!==''){
            setSubmitStatus(true)
        }else{
            setSubmitStatus(false)
        }
    }

    const OnButtonTriggered = ()=>{
        setSubmitStatus(false)
        setPatientName('')
        setEmail('')
        setDateTime('')
    }

  const onnameChnaged = event=>{
        setPatientName(event.target.value);
    }

    const onemailChanged = event=>{
        setEmail(event.target.value);
    }

    const ondateChanged = event=>{
        setDateTime(event.target.value);
    }

    const renderSuccessView = ()=><div className='doctor-home-container'>
        <h1 className='doct-deta'>Doctor Details</h1>
        <img src={doctor.profile_image} alt={doctor.name} className='profile-image' />
        <p className='doctor-name'>{doctor.name}</p>
        <div className='row-container'>
            <p className='doctor-spec'>{doctor.specialization}</p> 
            <p className={doctor_available}>({doctor.availability_status})</p>
        </div>
        <div className='schedule-container'>
            <h1 className='schedule-heading'>Schedule</h1>
            <ul className='schedule-unordered'>{schedule.map(sch=>
                <li className='list-schedule'>
                <p className='day-week'>{daysOfWeek[sch.day_of_week -1]}</p>
                <div className="doctor-row-container">
                    <p className='start'>{sch.start_time}</p>
                    <p className='start'>{sch.end_time}</p>
                </div>
            </li>)}</ul>
        </div>
        <div className="popup-container">
   <Popup
     modal
     trigger={
       <button onClick={OnButtonTriggered} disabled={doctor.availability_status==='On Leave' || doctor.availability_status==='Fully Booked'} type="button" className="trigger-button">
         Book Appointment
       </button>
     }
   >
     {close => (
       <div className='pop-container'>
         <button
           type="button"
           className="trigger-plane-button"
           onClick={() => close()}
         >
           <RxCross1/>
         </button>
         {!submitStatus &&
             <form className='form-container' onSubmit={onFormSubmitted}>
            <label htmlFor='name' className='label'>patient Name</label>
            <input type='text' className='input-box' id='name' placeholder='Your Name' onChange={onnameChnaged}  value={patientName} required/>
            <label className='label' htmlFor='email'>Patient Email</label>
            <input className='input-box' type='email' id='email' placeholder='Your Email' onChange={onemailChanged}  value={email} required/>
            <label className='label' htmlFor='datetime'>Appointment Time & Date</label>
            <input className='input-box' type='datetime-local' id='datetime' onChange={ondateChanged} value={dateTime}/>
            <button className='button-submit' type='submit'>Confrim</button>
         </form>
         }
         {submitStatus && <div className='empty-form-text'><p>Your Apoointment has been scheduled</p></div>}
         
         
       </div>
     )}
   </Popup>
 </div>        
    </div>

    const renderDoctorPage = () => {
    switch (activeState) {
      case apiStatusConstants.success:
        return renderSuccessView();
      case apiStatusConstants.failure:
        return renderFailureView();
      case apiStatusConstants.inProgress:
        return renderLoadingView();
      default:
        return null;
    }
  };
  return renderDoctorPage();
};

export default DoctorSpecific;
