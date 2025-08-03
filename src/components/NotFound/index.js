import './index.css'

const NotFound = () => (
  <div className="notfound-container">
    <img
      src="https://res.cloudinary.com/dvhtvbdud/image/upload/v1743195893/3828537_preview_rev_1_wyorce.png"
      alt="not found"
      className="job-image"
    />
    <h1 className="failure-heading">Page Not Found</h1>
    <p className="failure-description">
      We are sorry, the page you requested could not be found
    </p>
  </div>
)

export default NotFound