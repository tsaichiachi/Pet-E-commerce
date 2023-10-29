import React from "react";
import Link from "next/link";
import ProductCard from "@/components/home/home-product-card";

export default function BlockTwo() {
  return (
    <>
      <div className="block-two">
        <div className="row row-cols-1 row-cols-md-3 g-4">
          <div className="col-lg-3">
            <div className="card h-100">
              <Link href="/">
                <ProductCard />
              </Link>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="card h-100">
              <Link href="/">
                <ProductCard />
              </Link>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="card h-100">
              <Link href="/">
                <ProductCard />
              </Link>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="card h-100">
              <Link href="/">
                <ProductCard />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
