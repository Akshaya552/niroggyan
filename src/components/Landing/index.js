import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { ClipLoader } from 'react-spinners';
import { SpecializationContext } from '../../context/SpecializationContext';
import './index.css';

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
};

const Landing = () => {
  const { specialization, setSpecialization } = useContext(SpecializationContext);

  const [doctorList, setDoctorList] = useState([]);
  const [activeState, setActiveState] = useState(apiStatusConstants.initial);
  const [specializationList, setSpecializationList] = useState([]);
  const [name, setSearchInput] = useState('');

  const fetchDoctor = async (customSpec = specialization, customName = name) => {
    setActiveState(apiStatusConstants.inProgress);
    try {
      const response = await fetch(
        `https://niroggyan-1-lm22.onrender.com/doctors?name=${customName}&specialization=${customSpec}`
      );
      if (response.ok) {
        const data = await response.json();
        setDoctorList(data);
        setActiveState(apiStatusConstants.success);

        // Build specialization list only once, or you can get it separately from API ideally
        const spec = new Set(data.map(e => e.specialization));
        setSpecializationList([...spec]);
      } else {
        setActiveState(apiStatusConstants.failure);
      }
    } catch (error) {
      setActiveState(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, [specialization]);

  const renderLoadingView = () => (
    <div className="loader-container">
      <ClipLoader color="#0b69ff" size={50} />
    </div>
  );

  const onClickTryAgain = () => {
    fetchDoctor();
  };

  const renderFailureView = () => (
    <div className="loader-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
        className="job-image"
      />
      <h1 className="failure-text">Something Went Wrong</h1>
      <button type="button" className="tryagain-button" onClick={onClickTryAgain}>
        Try Again
      </button>
    </div>
  );

  const onInputChanged = event => {
    setSearchInput(event.target.value);
  };

  const onSearchInitiated = () => {
    fetchDoctor();
  };

  const onSpecializationChange = (value) => {
    setSpecialization(value);
    // No manual reload needed; fetchDoctor triggers automatically because of useEffect dependency
  };

  const renderSuccessView = () => (
    <div className='success-home-container'>
      <div className='search-Container'>
        <input
          type='search'
          className='search-box'
          onChange={onInputChanged}
          value={name}
          placeholder="Search doctor by name"
        />
        <button type='button' className='search-icon' onClick={onSearchInitiated}>
          <FaSearch />
        </button>
      </div>

      <ul className='speci-list-container'>
        <button
          onClick={() => setSpecialization('')}
          className={specialization === '' ? 'special spec-button' : 'spec-button'}
          type='button'
        >
          All
        </button>
        {specializationList.map(each =>
          <li key={each}>
            <button
              className={specialization === each ? 'special spec-button' : 'spec-button'}
              type='button'
              onClick={() => onSpecializationChange(each)}
            >
              {each}
            </button>
          </li>
        )}
      </ul>

      <ul className='doctors-unordered-container'>
        {doctorList.map(e =>
          <li key={e.id} className='list-item'>
            <Link to={`/doctor/${e.id}`} className='link-item'>
              <img src={e.profile_image} alt={e.name} className='profile' />
              <p className='doctor-name'>{e.name}</p>
              <p className='doctor-name'>{e.specialization}</p>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );

  const renderLandingPage = () => {
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

  return renderLandingPage();
};

export default Landing;
