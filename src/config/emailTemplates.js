const mjml = require('mjml');
let protocol = (process.env.SSL_PROXY === true) ? 'https' : 'http';

module.exports = {
  activateAccount: (domain, token) => {
    /**
     *  @param domain
     *  Express is the domain from the request.
     *  @param token
     *  Express is the domain from the request.
     */
    return mjml(`<mjml>
  <mj-head>
       <mj-attributes>
      <mj-text font-size="13px"/>
      <mj-all fbackground-color="#ffffff"/>
    </mj-attributes>
  </mj-head>
  <mj-body>
          <mj-section>
            <mj-column>
              <mj-text font-style="bold" font-size="24px" color="#626262" align="center">
                Your account details
              </mj-text>
	<mj-divider border-color="#4f92ff" />
            </mj-column>
          </mj-section>
          <mj-wrapper padding-top="0">
            <mj-section padding-top="0">
              <mj-column>
                <mj-text>
                  You are receiving this because you (or someone else) created a account ${process.env.TITLE}.
                </mj-text>
              </mj-column>
            </mj-section>
            <mj-section>
              <mj-column>
                <mj-text>Please click activate to finalize your account creation.</mj-text>
                <mj-text>If you did not request this account to be made or want your data removed. Please click the delete button.</mj-text>
              </mj-column>
            </mj-section>
            <mj-section>
              <mj-column>
                <mj-button href="${protocol}://${domain}/user/activate/${token}" font-family="Helvetica" background-color="#4f92ff" color="white">
                  Activate
                </mj-button>
              </mj-column>
              <mj-column>
                <mj-button href="http://${domain}/user/delete/${token}" font-family="Helvetica" background-color="#4f92ff" color="white">
                  Delete Account
                </mj-button>
              </mj-column>
            </mj-section>
          </mj-wrapper>
        </mj-body>
      </mjml>`);
  },
  passwordReset: (domain, token) => {
    /**
 *  @param domain
 *  Express is the domain from the request.
 *  @param token
 *  Express is the domain from the request.
 */
  }
};
