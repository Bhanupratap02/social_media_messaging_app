/** @format */

import React, { createRef } from "react";
import HeadTags from "./HeadTags";
import Navbar from "./Navbar";
import {
  Container,
  Visibility,
  Grid,
  Sticky,
  Ref,
  Divider,
  Segment,
} from "semantic-ui-react";
import nProgress from "nprogress";
import Router ,{useRouter}from "next/router";
import SideMenu from "./SideMenu";
import Search from "./Search";
import MobileHeader from "./MobileHeader";
import {createMedia} from "@artsy/fresnel"


const AppMedia = createMedia({breakpoints:{zero:0,mobile:549,tablet:850,computer:1080}})
const mediaStyles = AppMedia.createMediaStyle()
const {Media,MediaContextProvider} = AppMedia


function Layout({ children, user }) {
  const contextRef = createRef();
  const router = useRouter()
  const messagesRoute = router.pathname === "/messages"
  Router.onRouteChangeStart = () => nProgress.start();
  Router.onRouteChangecomplete = () => nProgress.done();
  Router.onRouteChangeError = () => nProgress.done();

  return (
    <div>
      <HeadTags />
      {user ? (
        <>
          <style>{mediaStyles}</style>
          <MediaContextProvider>
            <div
              style={{
                marginLeft: "1rem",
                marginRight: "1rem"
                
              }}
            >
              {/* layout for divices computer size */}
              <Media greaterThanOrEqual="computer">
                <Ref innerRef={contextRef}>
                  <Grid
                   
                    // style={{
                    //   backgroundImage:
                    //     " radial-gradient(circle, #ffffff, #fafafc, #f6f6f9, #f0f1f7, #ebedf4, #e7ecf3, #e3eaf2, #dfe9f0, #dceaef, #daeaee, #d9ebec, #d8ebe9)",
                    // }}
                  >
                    {!messagesRoute ? (
                      <>
                        <Grid.Column
                          floated="left"
                          width={3}
                        >
                          <Sticky context={contextRef}>
                            <SideMenu user={user} pc />
                          </Sticky>
                        </Grid.Column>

                        <Grid.Column
                         
                          width={9}
                        >
                          <Visibility
                           
                            context={contextRef}
                          >
                            {children}
                          </Visibility>
                        </Grid.Column>

                        <Grid.Column floated="left" width={4}>
                          <Sticky context={contextRef}>
                            <Segment basic>
                              <Search />
                            </Segment>
                          </Sticky>
                        </Grid.Column>
                      </>
                    ) : (
                      <>
                        <Grid.Column floated="left" width />
                        <Grid.Column width={15}>{children}</Grid.Column>
                      </>
                    )}
                  </Grid>
                </Ref>
              </Media>
              {/* layout for divices between tablet and computer size */}
              <Media between={["tablet", "computer"]}>
                <Ref innerRef={contextRef}>
                  <Grid>
                    {!messagesRoute ? (
                      <>
                        <Grid.Column floated="left" width={1}>
                          <Sticky context={contextRef}>
                            <SideMenu user={user} pc={false} />
                          </Sticky>
                        </Grid.Column>

                        <Grid.Column width={15}>
                          <Visibility context={contextRef}>
                            {children}
                          </Visibility>
                        </Grid.Column>
                      </>
                    ) : (
                      <>
                        <Grid.Column floated="left" width />
                        <Grid.Column width={15}>{children}</Grid.Column>
                      </>
                    )}
                  </Grid>
                </Ref>
              </Media>

              {/* layout for divices between mobile and tablet size */}
              <Media between={["mobile", "tablet"]}>
                <Ref innerRef={contextRef}>
                  <Grid>
                    {!messagesRoute ? (
                      <>
                        <Grid.Column floated="left" width={2}>
                          <Sticky context={contextRef}>
                            <SideMenu user={user} pc={false} />
                          </Sticky>
                        </Grid.Column>

                        <Grid.Column width={14}>
                          <Visibility context={contextRef}>
                            {children}
                          </Visibility>
                        </Grid.Column>
                      </>
                    ) : (
                      <>
                        <Grid.Column floated="left" width />
                        <Grid.Column width={15}>{children}</Grid.Column>
                      </>
                    )}
                  </Grid>
                </Ref>
              </Media>
              {/* layout for divices between zero to mobile */}
              <Media between={["zero", "mobile"]}>
                <MobileHeader user={user} />
                <Grid>
                  <Grid.Column>{children}</Grid.Column>
                </Grid>
              </Media>
            </div>
          </MediaContextProvider>
        </>
      ) : (
        <>
          <Navbar />

          <Container style={{ paddingTop: "1rem" }} text>
            {children}
          </Container>
        </>
      )}
    </div>
  );
}

export default Layout;
