const express = require("express");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require('sqlite3');
const cors = require("cors");
app.use(express.json());
app.use(cors());

const dbPath = path.join(__dirname, "database.db");

const { parseISO, format } = require('date-fns');

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000");
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

initializeDbAndServer();

app.get('/doctors', async (req, res) => {
  const {name,specialization} = req.query;
  const doctorsQuery = `SELECT * FROM doctor WHERE name LIKE '%${name}%' AND specialization LIKE '%${specialization}%';`
  const doctors = await db.all(doctorsQuery);
  res.send(doctors);
});


app.get('/doctors/:doctorId/', async (req, res) => {
  const {doctorId} = req.params;
  const singleQuery = `SELECT id, name, specialization, profile_image, availability_status FROM doctor WHERE id = ${doctorId};`
  const doctorSpecific = await db.get(singleQuery);
    if (doctorSpecific.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    else{
      const scheduledQuery = `SELECT day_of_week, start_time, end_time FROM doctor_schedule WHERE doctor_id = ${doctorId};`
      const scheduleRows = await db.all(scheduledQuery);
      res.json({ doctorSpecific, schedule: scheduleRows });
  } 
    }
);

app.post('/api/appointments', async (req, res) => {
  const { doctor_id, patient_name, email, appointment_datetime } = req.body;

  if (!doctor_id || !patient_name || !email || !appointment_datetime) {
    return res.status(400).json({ message: 'Missing required fields' });
  }else{

    const parsedDate = parseISO(appointment_datetime);
    const formattedDate = format(parsedDate, 'yyyy-MM-dd HH:mm:ss');

    const conflictsQuery =`SELECT id FROM appointment WHERE doctor_id = ${doctor_id} AND appointment_datetime = '${formattedDate}';`
    const conflicts = await db.all(conflictsQuery);
    if (conflicts.length > 0) {
      return res.status(409).json({ message: 'Time slot already booked' });
    }else{
      const postQuery = `INSERT INTO appointment (doctor_id, patient_name, email, appointment_datetime) VALUES (${doctor_id},'${patient_name}', '${email}','${formattedDate}');`
      await db.run(postQuery)
      res.send({ message: 'Appointment booked successfully' })
    }
  }
  }  
);

app.get('/doctors/schedule/:doctorId/',async (req,res)=>{
  const {doctorId} = req.params
  const docScheduleQuery = `SELECT * from appointment where doctor_id= ${doctorId};`
  const scedh = await db.all(docScheduleQuery);
  res.send(scedh);
})