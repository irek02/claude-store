import Link from 'next/link'

export default function Home() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center mt-5">Welcome to Claude Store Generator</h1>
          <p className="text-center text-muted mb-4">
            AI-powered online store generator that creates custom stores from user prompts
          </p>
          <div className="text-center">
            <Link href="/login" className="btn btn-primary">
              Store Manager Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}