
function Spinner() {
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 h-screen bg-slate-500 opacity-40">
        <div className="animate-spin rounded-full h-16 w-16 border-t-8 border-red-500"></div>
      </div>
    );
  }
  
  export default Spinner;
  