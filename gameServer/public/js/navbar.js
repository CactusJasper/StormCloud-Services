$(() => {
    $('#chk').on('click', (e) => {
        if(e.target.checked)
        {
            $('.container').hide(400);
            $('.pfp').hide();
            $('.mobile-nav').show();
        }
        else
        {
            $('.container').show(600);
            $('.pfp').show(600);
            $('.mobile-nav').hide(600);
        }
    });
});

function toggleDropdown()
{
    if($('#pfp-dropdown').css('display') == 'none')
    {
        $('#pfp-dropdown').show(400);
    }
    else
    {
        $('#pfp-dropdown').hide(400);
    }
}