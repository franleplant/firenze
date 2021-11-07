import { useCeramicProfile } from "client/io/profile";
import { NextPage } from "next"

const FirenzeProfile: NextPage = () => {
  const { data: profile } = useCeramicProfile();
  console.log("Received profile", profile);
  return (
  <div>
    <h1>Firenze Profile</h1>
    <ul>
      <li>Posts StreamID: {profile?.posts}</li>
    </ul>
  </div>
  )
}

export default FirenzeProfile;