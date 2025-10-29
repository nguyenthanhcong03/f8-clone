export default function GlobalLoading() {
  return (
    <div className='fixed left-0 top-0 z-[2001] w-full'>
      <div className='w-full bg-secondary'>
        <div className='h-1 animate-pulse bg-primary'></div>
      </div>
    </div>
  )
}
