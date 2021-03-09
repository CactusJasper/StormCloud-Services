$(() => {
    let socket = io();

    socket.on('connect', () => {
        console.log('WS Opened');
        socket.emit('updateUserData', {});

        setInterval(() => {
            socket.volatile.emit('updateUserData', {});
        }, (60 * 1000) * 10);
    });

    $(document).on('click', '.remove-field', (event) => {
        event.preventDefault();
        
        let fieldId = parseInt(event.target.dataset.fieldid);
        $('#addField')[0].dataset.currentcount = $('#addField')[0].dataset.currentcount - 1;
        $(`#field-${fieldId}`).remove();

        for(let i = fieldId + 1; i < 16; i++)
        {
            if($(`#field-${i}`)[0] != undefined)
            {
                $($(`#field-${i}`).children()[0]).text(`Option ${i - 1}`);

                $($($(`#field-${i}`).children()[1]).children()[0]).attr('placeholder', `Option ${i - 1}`);
                $($($(`#field-${i}`).children()[1]).children()[0]).attr('id', `${i - 1}`);
                $($($(`#field-${i}`).children()[1]).children()[0]).attr('name', `${i - 1}`);

                $($(`#field-${i}`).children()[2]).children()[0].dataset.fieldid = parseInt(i - 1);

                $($(`#field-${i}`)[0]).attr('id', `field-${i - 1}`);
            }
        }
    });

    $('#addField').click((event) => {
        event.preventDefault();

        let totalCount = parseInt($(event.target)[0].dataset.currentcount);
        let toAdd = totalCount + 1;

        if(toAdd < 16 && toAdd > 2)
        {
            let html = `<tr id="field-${toAdd}">`;
            html += `<td class="p-2 center">Option ${toAdd}</td>`;
            html += `<td class="pt-1"><input type="text" id="${toAdd}" name="${toAdd}" placeholder="Option ${toAdd}" class="text-colour"/></td>`;
            html += `<td class="pt-1"><button data-fieldid="${toAdd}" class="text-colour remove-field px-3 ml-3">&#10006;</button></td>`;
            html += `</tr>`;

            $('#fieldList').append(html);
            $(event.target)[0].dataset.currentcount = totalCount + 1;
        }
    });
});