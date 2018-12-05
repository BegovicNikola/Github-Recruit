$(document).ready(() => {

    // Going to Home Page
    function navigate_home(){

        $('html, body').animate({ scrollTop: 0 }, "slow");
        ScrollReveal().clean('#content');
        ScrollReveal().reveal('#content', { delay: 700, duration: 700 });

        render_users(user);
        $('.nav-item').removeClass('active');
        $('#navigate_home').addClass('active');
    }
    $('#navigate_home').click(navigate_home);
    $('#logo').click(navigate_home);

    // Going to About Page
    $('#navigate_about').click(function(){

        $('html, body').animate({ scrollTop: 0 }, "slow");
        ScrollReveal().clean('#content');
        ScrollReveal().reveal('#content', { delay: 700, duration: 700 });

        const my_name = 'BegovicNikola';
        render_user(my_name);
        $('.nav-item').removeClass('active');
        $(this).addClass('active');
    });
    // Going to Features Page
    $('#navigate_features').click(function(){

        $('html, body').animate({ scrollTop: 0 }, "slow");
        ScrollReveal().clean('#content');
        ScrollReveal().reveal('#content', { delay: 700, duration: 700 });

        render_features();
        $('.nav-item').removeClass('active');
        $(this).addClass('active');
    });

    // Background auto-slideshow 
    let banner_holder = $('#banner_images');
    console.log(banner_holder);
    const banner_images = ['images/banner1.jpg', 'images/banner3.jpg','images/banner2.jpg', 'images/banner3.jpg'];
    let curr = 1;
    const auto_slide = () => {
        banner_holder.fadeOut(800, function () {
            banner_holder.css("background-image", `url(${banner_images[curr++%banner_images.length]})`);
            banner_holder.fadeIn(1000);
        });
    } 
    setInterval(auto_slide, 4000);

    // Focus on Search Field
    $('#search').focus();

    // Users Variables
    let user = 'a';
    let page = 1;
    let per_page = 6;

    // Check for Valid Search Input 
    const srcRegEx = /^[a-z\s\b]+$/i;
    let srcInput = $('#search');

    // Ajax on Page Load
    ScrollReveal().reveal('#content', { delay: 700, duration: 700 });
    render_users(user);

    // Search for Users Function
    let timeout = null;
    (function search_users(){
        srcInput.on('keyup', e => {

            // Getting Input Value
            user = e.target.value;
            if(user == ''){
                user = 'a';
            }

            // Clearing Timeout
            clearTimeout(timeout);

            // Timeout Lasts 500 Milliseconds After User is Done with Input
            timeout = setTimeout(() => {
                if(srcRegEx.test(user)){
                    render_users(user);
                    $('#warning')[0].style.color = 'transparent';
                }else{
                    $('#warning')[0].style.color = 'red';
                }
            }, 500);

        });
    })();

    // Ajax Function for Rendering Multiple Users
    function render_users(user, page = 1, per_page = 6){

        // Main Ajax Call for Rendering a Grid of Users
        $.ajax({
            url: `https://api.github.com/search/users`,
            data:{
                client_id:'71e24cf7dcf8b14c8713',
                client_secret:'4afda53eca11550c8cda6fc149f11b47badd0c56',
                q: user,
                page: page,
                per_page: per_page
            }
        }).done(user_data => {
            // Getting Array of Users Only
            var user_data = user_data.items;
            console.log(user_data, page, per_page);
            var html = '';

            user_data.forEach(user_item => {
                html += 
                `<div class="content_item mb-4 col-lg-4 col-md-6" data-username="${user_item.login}">
                    <div class="card">
                        <div class="card_img_holder rounded-top">
                            <img class="card-img-top" src="${user_item.avatar_url}" alt="User Avatar ${user_item.login}">
                        </div>
                        <div class="card-body rounded-bottom d-flex justify-content-between align-items-center bg-dark text-white">
                            <h3 class="mb-0 font-weight-bolder">${user_item.login}</h3>
                            <div>
                                <span class="fab fa-github"></span>
                                <span>${Math.round(user_item.score)}</span>
                            </div>
                        </div>
                    </div>
                </div>`;
            });

            // Adding Result to Result Render Holder
            $('#content').html(html);

            // Adding Load More Results Button
            $('#pagination_holder').html(`
                <button id="load_more" class="btn btn-lg btn-dark border border-white rounded-circle">
                    <span class="far fa-map"></span>
                </button>`
            );

            // Loading New Ajax With More Results
            $('#load_more').click(() => {
                per_page += 6;
                render_users(user, page, per_page);
            });

            // Replacing Render of Users with a Single User on Click
            var user_name = '';
            $('.content_item').click(function(e){

                $('html, body').animate({ scrollTop: 0 }, "slow");
                ScrollReveal().clean('#content');
                ScrollReveal().reveal('#content', { delay: 700, duration: 700 });

                user_name = e.currentTarget.attributes[1].value;
                render_user(user_name);
            });

        });

    }

    // Ajax Function for Rendering Single User
    const render_user = (user_name) => {
        // Main Ajax Call for Rendering a Single User
        $.ajax({
            url: `https://api.github.com/users/${user_name}`,
            data:{
                client_id:'71e24cf7dcf8b14c8713',
                client_secret:'4afda53eca11550c8cda6fc149f11b47badd0c56'
            }
        }).done(user_data => {

            // Repository Ajax Call for Repos of the Current User
            render_repos(user_name, current_page = 1);

            console.log(user_data);
            var html = '';
            
            html += 
            `<div class="user_item col-12">
                <div class="row align-items-center">
                    <div class="col-md-4">
                        <img class="w-100 rounded-circle border" src="${user_data.avatar_url}" alt="User Avatar ${user_data.name}">
                    </div>
                    <div class="col-md-8">
                        <div class="card mt-3">
                            <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-end">
                                    <h3 class="card-title mb-0 text-capitalize">${(user_data.name).toLowerCase()}</h3>
                                </div>
                                <span class="${hireable(user_data.hireable)} pt-1"></span>
                            </div>
                            <div class="list-group list-group-flush">
                                <p class="list-group-item">Email: ${displayAttribute(user_data.email)}</p>
                                <p class="list-group-item">Location: ${displayAttribute(user_data.location)}</p>
                                <p class="list-group-item">Company: ${displayAttribute(user_data.company)}</p>
                                <p class="list-group-item">Bio: ${displayAttribute(user_data.bio)}</p>
                                <p class="list-group-item">Last Active: ${truncateDate(user_data.updated_at)}</p>
                                <div class="list-group-item">
                                    <span class="badge badge-success p-1">Repos: ${user_data.public_repos}</span>
                                    <span class="badge badge-primary p-1">Gists: ${user_data.public_gists}</span>
                                    <span class="badge badge-info p-1">Followers: ${user_data.followers}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <a href="${user_data.html_url}" target="_blank" class="btn btn-${hireable_viewmore(user_data.hireable)} text-white font-weight-bold w-100 mt-3">Go to Profile</a>
                    </div>
                    <div class="col-12 my-3">
                        <div class="card">
                            <div class="card-header bg-dark text-white rounded-top">
                                <h4 class="text-center text-capitalize">${get_name_only(user_data.name).toLowerCase()}'s Repositories</h4>
                            </div>
                            <div id="repos" class="list-group list-group-flush"></div>
                            <div class="w-100 d-flex">
                                <button id="back" class="col-5 btn btn-dark text-center text-white py-2 fas fa-chevron-left border-right"></button>
                                <span id="current_page" class="col-2 d-flex justify-content-center align-items-center bg-dark text-white font-weight-bold">1</span>
                                <button id="next" class="col-5 btn btn-dark text-center text-white py-2 fas fa-chevron-right border-left"></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

            // Adding Result to Result Render Holder
            $('#content').html(html);

            // Adding Back To Home Button
            $('#pagination_holder').html(`
                <button id="go_home" class="btn btn-lg btn-dark border border-${hireable_viewmore(user_data.hireable)} rounded-circle">
                    <span class="fas fa-home"></span>
                </button>`
            );
            $('#go_home').click(navigate_home);

            // Pagination Control
            var current_page = 1;
            $('#next').click(() => {
                current_page++;
                $('#back').prop("disabled", false).removeClass('btn-secondary').addClass('btn-dark');
                render_repos(user_name, current_page);
            });
            $('#back').click(() => {
                if(current_page >= 2){
                    --current_page;
                    $('#back').prop("disabled", false).removeClass('btn-secondary').addClass('btn-dark');
                    render_repos(user_name, current_page);
                }else{
                    $('#back').prop("disabled", true).addClass('btn-secondary').removeClass('btn-dark');
                }
            });

        });
    }

    // Ajax Function to Render User's Repositories
    const render_repos = (user_name, current_page = 1) => {
        $.ajax({
            url:`https://api.github.com/users/${user_name}/repos`,
            data:{
                client_id:'71e24cf7dcf8b14c8713',
                client_secret:'4afda53eca11550c8cda6fc149f11b47badd0c56',
                sort: 'created: asc',
                page: current_page,
                per_page: 5
            }
        }).done(repos => {
            console.log(repos);
            var html = '';

            // Checking if Next Page is Populated with Data
            if(repos.length > 0){
                repos.forEach(repo_item => {
                    html += 
                    `<div class="list-group-item">
                        <div class="row">
                            <div class="col-lg-7">
                                <h5>${repo_item.name}</h5>
                                <p>${displayAttribute(repo_item.description)}</p>
                            </div>
                            <div class="col-lg-3 d-flex align-items-center py-2">
                                <span class="badge badge-success p-1 mr-1">Forks: ${repo_item.forks_count}</span>
                                <span class="badge badge-primary p-1 mr-1">Watchers: ${repo_item.watchers_count}</span>
                                <span class="badge badge-info p-1">Stars: ${repo_item.stargazers_count}</span>
                            </div>
                            <div class="col-lg-2 d-flex align-items-center">
                                <a href="${repo_item.html_url}" target="_blank"class="door btn btn-dark w-100">
                                    Repository<span class="ml-2 fas fa-door-open text-white"></span>
                                </a>
                            </div>
                        </div>
                    </div>`;
                });
                // Adding Results of Repos to Render Holder
                $('#repos').html(html);
                // Enable Next Click
                $('#next').prop("disabled", false).removeClass('btn-secondary').addClass('btn-dark');
                // Displaying Current Page of Repos
                $('#current_page').html(current_page);
            }else{
                // Disable Next Click
                $('#next').prop("disabled", true).addClass('btn-secondary').removeClass('btn-dark');
            }

        });
    }

    // Handling Null Values in Returned Object
    const displayAttribute = att_check => {
        if(att_check == null){
            return `No Information Provided...`;
        }else{
            return att_check;
        }
    }

    // Truncate Date Values in Returned Object
    const truncateDate = date_trunc => {
        return date_trunc = date_trunc.replace('T', ' at ').replace('Z', '');
    }

    // Checking if Developer is Hireable
    const hireable = hireable => {
        if(hireable){
            return 'fas fa-check-circle text-success';
        }else{
            return 'fas fa-times-circle text-danger';
        }
    }

    // Returning Color Depending on if hireable
    const hireable_viewmore = hireable => {
        if(hireable){
            return 'success';
        }else{
            return 'danger';
        }
    }

    // Truncating Full Name
    const get_name_only = full_name => {
        let res = full_name.split(' ');
        return res[0];
    }

    // Function to Render Features
    const render_features = () => {

        // Populating Content Holder with Features
        $('#content').html(`
            <div class="col-12">
                <h1 id="features_title" class="text-center font-weight-bold">Github Recruit Features</h1>
                <div class="container">
                    <button id="docs" class="w-100 btn btn-success font-weight-bold">Documentation</button>
                </div>
                <div class="mt-5 w-100 d-flex flex-column justify-content-between">
                <!-- ScrollReveal.js Feature -->
                    <div id="scrollreveal_feature" class="w-100 d-flex flex-wrap justify-content-between align-items-stretch">
                        <div class="col-lg-4">
                            <img class="w-100 h-100 rounded border" src="images/scrollreveal.gif" alt="Scroll Reveal Showcase"/>
                        </div>
                        <div class="col-lg-8">
                            <div class="card">
                                <div class="card-header bg-dark text-white rounded-top">
                                    <h4 class="text-center text-capitalize font-weight-bold mb-0">ScrollReveal.js</h4>
                                </div>
                                <div class="list-group list-group-flush">
                                    <div class="list-group-item">
                                        <code class="text-secondary">Source URL: "https://unpkg.com/scrollreveal";</code><br/>
                                        <code class="text-secondary">Example: ScrollReveal().reveal('#example', { delay: 500, duration: 500 });</code>
                                    </div>
                                    <div class="list-group-item d-flex flex-wrap">
                                        <img class="col-md-6" src="images/scrollreveal.png" alt="Scroll Reveal Display"/>
                                        <div class="col-md-6">
                                            <p><strong>ScrollReveal</strong> is a JavaScript library for easily animating elements as they enter/leave the viewport. It was designed to be robust and flexible, but hopefully you’ll be surprised below at how easy it is to pick up.</p>
                                        </div>
                                    </div>
                                </div>   
                            </div>
                        </div>
                    </div>
                <!-- Github API Feature -->
                    <div id="github_feature" class="mt-5 w-100 d-flex flex-wrap justify-content-between align-items-center">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-header bg-dark text-white rounded-top">
                                    <h4 class="text-center text-capitalize font-weight-bold mb-0">Github API</h4>
                                </div>
                                <div class="list-group list-group-flush">
                                    <div class="list-group-item">
                                        <code class="text-secondary">Getting Data: GET /search/users</code><br/>
                                        <code class="text-secondary">Endpoint: https://api.github.com/search/users?q=user</code>
                                    </div>
                                    <div class="list-group-item d-flex flex-wrap align-items-start">
                                        <img class="col-md-3 rounded" src="images/github.jpg" alt="Scroll Reveal Display"/>
                                        <div class="col-md-9">
                                            <p><strong>GitHub Inc.</strong> is a web-based hosting service for version control using Git. It is mostly used for computer code. It offers all of the distributed version control and source code management (SCM) functionality of Git as well as adding its own features. It provides access control and several collaboration features such as bug tracking, feature requests, task management, and wikis for every project.<br/><strong>Using the API:</strong><br/>By default, all requests to <code class="text-secondary">https://api.github.com</code> receive the v3 version of the REST API.</p>
                                        </div>
                                    </div>
                                </div>   
                            </div>
                        </div>
                    </div>
                <!-- Git Feature -->
                    <div id="git_feature" class="mt-5 w-100 d-flex flex-wrap justify-content-between align-items-center">
                        <div class="col-md-3 my-1">
                            <img class="w-100 rounded" src="images/gitoriginal.png" alt="Git Logo"/>
                        </div>
                        <div class="col-md-6">
                            <div class="card">
                                <div class="card-header bg-dark text-white rounded-top">
                                    <h4 class="text-center text-capitalize font-weight-bold mb-0">Git - Version Control</h4>
                                </div>
                                <div class="list-group list-group-flush">
                                    <div class="list-group-item">
                                        <code class="text-secondary">Initiate: git init</code><br/>
                                        <code class="text-secondary">Commit: git commit -m "Example Commit"</code>
                                    </div>
                                    <div class="list-group-item d-flex">
                                        <p>Git is a free and open source distributed version control system designed to handle everything from small to very large projects with speed and efficiency. Git is easy to learn and has a tiny footprint with lightning fast performance.</p>
                                    </div>
                                </div>   
                            </div>
                        </div>
                        <div class="col-md-3 my-1">
                            <img class="w-100 rounded" src="images/gitwindows.png" alt="Git Windows Logo"/>
                        </div>
                    </div>
                <!-- ECMA Script 6 Feature -->
                    <div id="ecma_feature" class="mt-5 w-100 d-flex flex-wrap justify-content-between align-items-center">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-header bg-dark text-white rounded-top">
                                    <h4 class="text-center text-capitalize font-weight-bold mb-0">ECMA Script 6</h4>
                                </div>
                                <div class="list-group list-group-flush">
                                    <div class="list-group-item">
                                        <code class="text-secondary">Constants & Block Scope Variables: const / let</code><br/>
                                        <code class="text-secondary">Arrow Functons: () => { ...code }</code>
                                    </div>
                                    <div class="list-group-item d-flex flex-wrap align-items-start">
                                        <img class="col-md-3 rounded" src="images/es6.jpeg" alt="Scroll Reveal Display"/>
                                        <div class="col-md-9">
                                            <p><strong>ECMAScript</strong> or ES is a trademarked scripting-language specification standardized by Ecma International. It was created to standardize JavaScript, so as to foster multiple independent implementations. JavaScript has remained the best-known implementation of ECMAScript. ECMAScript is commonly used for client-side scripting, and it is increasingly being used for writing applications and services using Node.js.</p>
                                        </div>
                                    </div>
                                </div>   
                            </div>
                        </div>
                    </div>
                <!-- jQuery Feature -->
                    <div id="jquery_feature" class="mt-5 w-100 d-flex flex-wrap justify-content-between align-items-between">
                        <div class="col-lg-8">
                            <div class="card">
                                <div class="card-header bg-dark text-white rounded-top">
                                    <h4 class="text-center font-weight-bold mb-0">jQuery - v3.3.1</h4>
                                </div>
                                <div class="list-group list-group-flush">
                                    <div class="list-group-item">
                                        <code class="text-secondary">CDN: "https://code.jquery.com/jquery-3.3.1.min.js";</code><br/>
                                        <code class="text-secondary">Example: $('example').click(function{ ...code });</code>
                                    </div>
                                    <div class="list-group-item d-flex flex-wrap">
                                        <p><strong>jQuery</strong> is a fast, small, and feature-rich JavaScript library. It makes things like HTML document traversal and manipulation, event handling, animation, and Ajax much simpler with an easy-to-use API that works across a multitude of browsers. With a combination of versatility and extensibility, jQuery has changed the way that millions of people write JavaScript.</p>
                                    </div>
                                </div>   
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <img class="w-100 h-100 rounded" src="images/jquery.png" alt="Scroll Reveal Showcase"/>
                        </div>
                    </div>
                <!-- Bootstrap Feature -->
                    <div id="bootstrap_feature" class="my-5 w-100 d-flex flex-wrap justify-content-between align-items-between">
                        <div class="col-lg-8">
                            <div class="card">
                                <div class="card-header bg-dark text-white rounded-top">
                                    <h4 class="text-center font-weight-bold mb-0">Bootstrap - v4.1.3</h4>
                                </div>
                                <div class="list-group list-group-flush">
                                    <div class="list-group-item">
                                        <code class="text-secondary">CDN Js: "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js";</code><br/>
                                        <code class="text-secondary">CDN Css: "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css";</code>
                                    </div>
                                    <div class="list-group-item d-flex flex-wrap">
                                        <p>Build responsive, mobile-first projects on the web with the world's most popular front-end component library. <strong>Bootstrap</strong> is an open source toolkit for developing with HTML, CSS, and JS. Quickly prototype your ideas or build your entire app with our Sass variables and mixins, responsive grid system, extensive prebuilt components, and powerful plugins built on jQuery.</p>
                                    </div>
                                </div>   
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <img class="w-100 h-100 rounded" src="images/bootstrap.png" alt="Scroll Reveal Showcase"/>
                        </div>
                    </div>
                </div>
            </div>
        `);

        // Adding Back To Home Button
        $('#pagination_holder').html(`
            <button id="go_home" class="btn btn-lg btn-dark border border-white rounded-circle">
                <span class="fas fa-home"></span>
            </button>`
        );
        $('#go_home').click(navigate_home);

        // Plugin Modal for Document Download
        $('#docs').click(() => {
            $.MessageBox(`
                <div class="d-flex flex-column justify-content-center text-center">
                    <p>Click download to get the documentation from <code class="text-danger">docs.pdf</code></p>
                    <a class="btn btn-success" href="files/docs.pdf" download>Download</a>
                </div>
            `);
        });

        // Scroll Reveal Effects for Featured Items
        ScrollReveal().clean('#docs');
        ScrollReveal().reveal('#docs', { delay: 1400, duration: 700, origin: 'top', distance: '300px' });
        ScrollReveal().clean('#scrollreveal_feature');
        ScrollReveal().reveal('#scrollreveal_feature', { delay: 2100, duration: 700, origin: 'top', distance: '300px' });
        ScrollReveal().clean('#github_feature');
        ScrollReveal().reveal('#github_feature', { delay: 600, duration: 700, origin: 'top', distance: '300px' });
        ScrollReveal().clean('#git_feature .col-md-3');
        ScrollReveal().reveal('#git_feature .col-md-3', { delay: 600, duration: 700, origin: 'top', distance: '300px'});
        ScrollReveal().clean('#git_feature .col-md-6');
        ScrollReveal().reveal('#git_feature .col-md-6', { delay: 600, duration: 700, origin: 'top', distance: '100px'});
        ScrollReveal().clean('#ecma_feature');
        ScrollReveal().reveal('#ecma_feature', { delay: 600, duration: 700, origin: 'top', distance: '300px'});
        ScrollReveal().clean('#bootstrap_feature');
        ScrollReveal().reveal('#bootstrap_feature', { delay: 600, duration: 700, origin: 'top', distance: '300px'});
        ScrollReveal().clean('#jquery_feature');
        ScrollReveal().reveal('#jquery_feature', { delay: 600, duration: 700, origin: 'top', distance: '300px'});
    }

});