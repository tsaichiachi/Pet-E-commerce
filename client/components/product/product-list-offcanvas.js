import React from 'react';
import { HiOutlineFilter } from 'react-icons/hi';


export default function ProductListOffcanvas() {
    return (
        <>
            <button className="product-sidebar-btn btn-confirm size-5" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight"><HiOutlineFilter /></button>

            <div className="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">

                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasRightLabel">篩選</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>

                <div className="offcanvas-body ">
                        <div className="accordion" id="accordionPanelsStayOpenExample">
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="panelsStayOpen-headingCategory">
                                    <button
                                        className="accordion-button "
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#panelsStayOpen-collapseCategory"
                                        aria-expanded="true"
                                        aria-controls="panelsStayOpen-collapseCategory"
                                    >
                                        大類1
                                    </button>
                                </h2>
                                <div id="panelsStayOpen-collapseCategory" class="accordion-collapse collapse show">
                                    <div className="accordion-body row">
                                        <button className="button-subcategory" type="button" >
                                            小類
                                        </button>
                                        <button className="button-subcategory" type="button row">
                                            小類
                                        </button>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    {/* 要記得改id/data-bs-target/aria-controls/aria-labelledby數字 */}
                                    <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                                        <button className="accordion-button collapsed " type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                                            大類2
                                        </button>
                                    </h2>
                                    <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
                                        <div className="accordion-body row">
                                            <button className="button-subcategory no-border-btn" type="button" >
                                                小類
                                            </button>
                                            <button className="button-subcategory" type="button">
                                                小類
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='filter mt-3 '>
                            <div className="card filter-card">
                                <div className="card-header">
                                    其他選項
                                </div>
                                <div className="card-body">
                                    <form>
                                        <div className="col-12">
                                            <label for="inputprice" className="form-label">價格區間</label>
                                            <div className="row col-md">
                                                <div className="col-md-5">
                                                    <input type="number" className="form-control" id="price" placeholder="$最低價">
                                                    </input>
                                                </div>
                                                <div class="col-md dash">
                                                    ~
                                                </div>
                                                <div className="col-md-5">
                                                    <input type="number" className="form-control" id="price" placeholder="$最高價">
                                                    </input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 mt-2">
                                            <label for="brand" className="form-label">品牌</label>
                                            <input type="text" className="form-control" id="brand" placeholder="請輸入品牌關鍵字">
                                            </input>
                                        </div>
                                        <button type="submit" className="btn btn-brown col-12 mt-3">
                                            確定
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            

        </>
    )
}
