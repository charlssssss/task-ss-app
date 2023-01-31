const Custom404 = () => {
    return (
        <h1>404 - Page Not Found</h1>
    )
}
 
export default Custom404

Custom404.getLayout = function PageLayout(page) {
    return (
      <>
        {page}
      </>
    )
  }