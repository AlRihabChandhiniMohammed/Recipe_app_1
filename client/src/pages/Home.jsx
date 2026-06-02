import React from 'react'

const Home = () => {
  return (
    <div>
      <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel" style={{ maxWidth: "600px", margin: "auto" }}>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="./ppp1.jpg" className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item">
            <img src="./pppp.jpg" className="d-block w-100" height="400px" alt="..." />
          </div>
          <div className="carousel-item">
            <img src="./ppp111.webp" className="d-block w-100" height="400px" alt="..." />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  )
}

export default Home
