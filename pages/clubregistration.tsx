import { withRequireAuth } from '@hoc/with-auth';
import withTransition from '@hoc/with-transition';

function RegisterClub() {
  return <div>RegisterClub</div>;
}
export default withTransition(withRequireAuth(RegisterClub));
