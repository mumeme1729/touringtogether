import React,{useEffect,useState} from 'react'

const UseInfiniteScroll:any = (callback:any) => {
    const [isFetching, setIsFetching] = useState(false);
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }, []);

      useEffect(() => {
        if (!isFetching) return;
        callback(()=>{
        });
      }, [isFetching]);
    
      function handleScroll() {
        let scrollHeight = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight
          );
          let bottom = scrollHeight - document.documentElement.clientHeight;

          if( Math.round(window.pageYOffset)+1 >= bottom ){
              setIsFetching(true);
          };
      };
    return [isFetching,setIsFetching];
};

export default UseInfiniteScroll
