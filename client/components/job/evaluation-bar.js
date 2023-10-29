import React from "react";

const EvaluationBar = () => {
  return (
    <div className="evaluation-bar">
      <div className="evaluation-bar-left d-flex flex-column justify-content-center">
        <p className="size-3 text-center">5</p>
        <div className="ranking mb-2 mx-auto">
          <img src="/star.svg" alt="星星" />
          <img src="/star.svg" alt="星星" />
          <img src="/star.svg" alt="星星" />
          <img src="/star.svg" alt="星星" />
          <img src="/star.svg" alt="星星" />
        </div>
      </div>
      <div className="evaluation-bar-divider"></div>
      <div className="evaluation-bar-right d-flex flex-column justify-content-evenly">
        <div className="bar-group">
          <p className="number size-6">5</p>
          <div className="percentage">
            <div className="have"></div>
            <div className="no-have"></div>
          </div>
        </div>
        <div className="bar-group">
          <p className="number size-6">4</p>
          <div className="percentage">
            <div className="have"></div>
            <div className="no-have"></div>
          </div>
        </div>
        <div className="bar-group">
          <p className="number size-6">3</p>
          <div className="percentage">
            <div className="have"></div>
            <div className="no-have"></div>
          </div>
        </div>
        <div className="bar-group">
          <p className="number size-6">2</p>
          <div className="percentage">
            <div className="have"></div>
            <div className="no-have"></div>
          </div>
        </div>
        <div className="bar-group">
          <p className="number size-6">1</p>
          <div className="percentage">
            <div className="have"></div>
            <div className="no-have"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationBar;
