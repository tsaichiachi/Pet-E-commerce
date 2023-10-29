export default function Button() {
  return (
    <>
      <form className="d-flex justify-content-center align-items-center mt-2">
        <button type="submit" className=" btn-confirm mx-1 ">
          按鈕1送出(reqular)
        </button>
        <button type="button" className=" btn-second mx-1">
          按鈕2(reqular)
        </button>
        <button type="reset" className="btn-brown mx-1">
          按鈕3(reqular)
        </button>
        <button type="button" className="btn-price mx-1 disabled">
          按鈕4禁止(reqular)
        </button>
      </form>
      <div className="d-flex justify-content-center align-items-center mt-2">
        <button type="button" className="btn-outline-confirm mx-1">
          按鈕1(outline)
        </button>
        <button type="button" className="btn-outline-second mx-1">
          按鈕2(outline)
        </button>
        <button type="button" className="btn-outline-brown mx-1">
          按鈕3(outline)
        </button>
        <button type="button" className="btn-outline-price mx-1">
          按鈕4(outline)
        </button>
      </div>
      <span>font family套用測試</span>
      <p>這段是中文字測試</p>
      <p>English Test</p>

      <p class="size-1">字體大小測試</p>
      <p class="size-2">字體大小測試</p>
      <p class="size-3">字體大小測試</p>
      <p class="size-4">字體大小測試</p>
      <p class="size-5">字體大小測試</p>
      <p class="size-6">字體大小測試</p>
      <p class="size-7">字體大小測試</p>
    </>
  );
}
