<?php include("includes/header.php");?>
<?php include("includes/navigation.php");?>

    <!-- Banner -->
    <div id="banner_holder" class="position-relative mb-4">
        <div id="banner_images" class="position-absolute"></div>
        <div id="banner_overlay" class="position-absolute d-flex align-items-center justify-content-center">
            <div class="container text-center">
                <h1 class="font-weight-bold">Find Recruits</h1>
                <p>Github Recruit Offers a vast pool of developers to choose from. Find developers using their online portfolio which is Github.</p>
                <input id="search" class="form-control" type="text" placeholder="Search for dev..."/>
                <code id="warning">Invalid user parameter use letters only*</code>
            </div>
        </div>
    </div>
    <!-- Content -->
    <div class="container">
        <div id="content" class="row"><!-- Content Rendered Here --></div>
        <div id="pagination_holder"><!-- Navigation Buttons Rendered Here --></div>
    </div>

<?php include("includes/footer.php");?>