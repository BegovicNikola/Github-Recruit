$(document).ready(() => {

    // Going to About Page
    $('#about_me').click(function(){
        const my_name = 'BegovicNikola';
        render_user(my_name);
        $('.nav-item').each(function(){
            // Inner Scope
            $(this).removeClass('active');
        });
        // Outer Scope
        $(this).addClass('active');
    });

    // Background auto-slideshow 
    let banner_holder = $('#banner_images');
    console.log(banner_holder);
    const banner_images = ['images/banner1.jpg', 'images/banner2.jpg'];
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
            $('.content_item').each(function(){
                $(this).click(() => {
                    user_name = $(this).data("username");
                    render_user(user_name);
                });
            });

        });

    }

    // Ajax Function for Rendering Single User
    function render_user(user_name){

        // Main Ajax Call for Rendering a Single User
        $.ajax({
            url: `https://api.github.com/users/${user_name}`,
            data:{
                client_id:'71e24cf7dcf8b14c8713',
                client_secret:'4afda53eca11550c8cda6fc149f11b47badd0c56'
            }
        }).done(user_data => {

            // Repository Ajax Call for the Current User
            $.ajax({
                url:`https://api.github.com/users/${user_name}/repos`,
                data:{
                    client_id:'71e24cf7dcf8b14c8713',
                    client_secret:'4afda53eca11550c8cda6fc149f11b47badd0c56',
                    sort: 'created: asc',
                    per_page: 5
                }
            }).done(repos => {
                console.log(repos);
                $.each(repos, (index, repo) => {
                    $('#repos').append(
                        `<div class="list-group-item">
                            <div class="row">
                                <div class="col-lg-7">
                                    <h5>${++index}. ${repo.name}</h5>
                                    <p>${displayAttribute(repo.description)}</p>
                                </div>
                                <div class="col-lg-3 d-flex align-items-center py-2">
                                    <span class="badge badge-success p-1 mr-1">Forks: ${repo.forks_count}</span>
                                    <span class="badge badge-primary p-1 mr-1">Watchers: ${repo.watchers_count}</span>
                                    <span class="badge badge-info p-1">Stars: ${repo.stargazers_count}</span>
                                </div>
                                <div class="col-lg-2 d-flex align-items-center">
                                    <a href="${repo.html_url}" class="door btn btn-dark w-100">
                                        Repository<span class="ml-2 fas fa-door-open text-white"></span>
                                    </a>
                                </div>
                            </div>
                        </div>`
                    );
                });
            });

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
                        </div>
                    </div>
                </div>
            </div>`;

            // Adding Result to Result Render Holder
            $('#content').html(html);

            // Adding Back To Home Button
            $('#pagination_holder').html(`
                <a href="index.php" id="go_home" class="btn btn-lg btn-dark border border-${hireable_viewmore(user_data.hireable)} rounded-circle">
                    <span class="fas fa-home"></span>
                </a>`
            );

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
        return date_trunc = date_trunc.split('T')[0];
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

});