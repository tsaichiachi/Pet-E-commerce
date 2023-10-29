import React, { useState } from 'react';
import Link from "next/link";

export default function RoleSelection({ defaultActive }) {
  const [activeButton, setActiveButton] = useState(defaultActive);

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  return (
    <>
      <div className="btn-group role-selection" role="group">
        <button
          type="button"
          className={`btn ${activeButton === 'mission' ? 'active' : ''} border-0 size-6`}
          onClick={() => handleButtonClick('mission')}
        >
          <Link href={`/work/find-mission`} >找任務</Link>
          {activeButton === 'mission' && <span className="underline"></span>}
        </button>
        <button
          type="button"
          className={`btn ${activeButton === 'helper' ? 'active' : ''} border-0 size-6`}
          onClick={() => handleButtonClick('helper')}
        >
          <Link href={`/work/find-helper`} >找幫手</Link>
          {activeButton === 'helper' && <span className="underline"></span>}
        </button>
      </div>
    </>
  );
}
