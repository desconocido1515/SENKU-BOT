let WAMessageStubType = (await import(global.baileys)).default

export async function before(m, { conn, participants, isAdmin, isOwner }) {
    // Solo procesar eventos de grupo
    if (!m.messageStubType || !m.isGroup) return
    
    const usuario = `@${m.sender.split('@')[0]}`
    const grupo = await conn.groupMetadata(m.chat)
    const usuariosMencion = grupo.participants.map(v => v.id)
    
    // Crear un mensaje falso para citar (opcional)
    let fkontak = {
        "key": {
            "participants": "0@s.whatsapp.net",
            "remoteJid": "status@broadcast",
            "fromMe": false,
            "id": "Halo"
        },
        "message": {
            "contactMessage": {
                "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        },
        "participant": "0@s.whatsapp.net"
    }

    try {
        // 21 = CAMBIO DE NOMBRE DEL GRUPO
        if (m.messageStubType == 21) {
            await conn.sendMessage(m.chat, {
                text: `✨ *CAMBIO DE NOMBRE* ✨\n\n${usuario} cambió el nombre del grupo a:\n\n📌 *${m.messageStubParameters[0]}*`,
                mentions: [m.sender]
            }, { quoted: fkontak })
        }
        
        // 22 = CAMBIO DE FOTO DEL GRUPO
        else if (m.messageStubType == 22) {
            await conn.sendMessage(m.chat, {
                text: `🖼️ *CAMBIO DE FOTO* 🖼️\n\n${usuario} cambió la foto del grupo.`,
                mentions: [m.sender]
            }, { quoted: fkontak })
        }
        
        // 23 = ELIMINACIÓN DE FOTO DEL GRUPO
        else if (m.messageStubType == 23) {
            await conn.sendMessage(m.chat, {
                text: `🗑️ *FOTO ELIMINADA* 🗑️\n\n${usuario} eliminó la foto del grupo.`,
                mentions: [m.sender]
            }, { quoted: fkontak })
        }
        
        // 24 = CAMBIO DE DESCRIPCIÓN DEL GRUPO
        else if (m.messageStubType == 24) {
            await conn.sendMessage(m.chat, {
                text: `📝 *NUEVA DESCRIPCIÓN* 📝\n\n${usuario} cambió la descripción a:\n\n💬 *${m.messageStubParameters[0]}*`,
                mentions: [m.sender]
            }, { quoted: fkontak })
        }
        
        // 25 = CAMBIO DE CONFIGURACIÓN DE EDICIÓN (solo admins/todos)
        else if (m.messageStubType == 25) {
            const configuracion = m.messageStubParameters[0] == 'on' ? 'SOLO ADMINS' : 'TODOS'
            await conn.sendMessage(m.chat, {
                text: `⚙️ *CONFIGURACIÓN DE EDICIÓN* ⚙️\n\n${usuario} cambió quién puede editar la información:\n\n🔰 *Ahora: ${configuracion}*`,
                mentions: [m.sender]
            }, { quoted: fkontak })
        }
        
        // 26 = CERRAR/ABRIR GRUPO (solo admins pueden enviar mensajes)
        else if (m.messageStubType == 26) {
            const estado = m.messageStubParameters[0] == 'on' ? '🔒 CERRADO' : '🔓 ABIERTO'
            const mensaje = m.messageStubParameters[0] == 'on' 
                ? '• Solo los administradores pueden enviar mensajes'
                : '• Todos pueden enviar mensajes'
            
            await conn.sendMessage(m.chat, {
                text: `🚪 *GRUPO ${estado}* 🚪\n\n${usuario} cambió la configuración del grupo:\n\n${mensaje}`,
                mentions: [m.sender]
            }, { quoted: fkontak })
        }
        
        // 27 = INVITAR MIEMBROS (código de invitación)
        else if (m.messageStubType == 27) {
            await conn.sendMessage(m.chat, {
                text: `🔗 *ENLACE DE INVITACIÓN* 🔗\n\n${usuario} cambió el enlace de invitación del grupo.`,
                mentions: [m.sender]
            }, { quoted: fkontak })
        }
        
        // 28 = SALIDA DE MIEMBRO
        else if (m.messageStubType == 28) {
            const quienSalio = `@${m.messageStubParameters[0]?.split('@')[0]}`
            await conn.sendMessage(m.chat, {
                text: `👋 *SALIÓ DEL GRUPO* 👋\n\n${quienSalio} abandonó el grupo.`,
                mentions: [m.messageStubParameters[0]]
            }, { quoted: fkontak })
        }
        
        // 29 = NUEVO ADMIN
        else if (m.messageStubType == 29) {
            const nuevoAdmin = `@${m.messageStubParameters[0]?.split('@')[0]}`
            await conn.sendMessage(m.chat, {
                text: `👑 *NUEVO ADMINISTRADOR* 👑\n\n${nuevoAdmin} ahora es administrador.\n\n🛡️ Acción realizada por: ${usuario}`,
                mentions: [m.messageStubParameters[0], m.sender]
            }, { quoted: fkontak })
        }
        
        // 30 = DEJA DE SER ADMIN
        else if (m.messageStubType == 30) {
            const exAdmin = `@${m.messageStubParameters[0]?.split('@')[0]}`
            await conn.sendMessage(m.chat, {
                text: `📉 *DEJA DE SER ADMIN* 📉\n\n${exAdmin} ya no es administrador.\n\n🛡️ Acción realizada por: ${usuario}`,
                mentions: [m.messageStubParameters[0], m.sender]
            }, { quoted: fkontak })
        }
        
        // 31 = NUEVO MIEMBRO (entrada por invitación)
        else if (m.messageStubType == 31) {
            const nuevoMiembro = `@${m.messageStubParameters[0]?.split('@')[0]}`
            await conn.sendMessage(m.chat, {
                text: `🎉 *NUEVO MIEMBRO* 🎉\n\n¡Bienvenido ${nuevoMiembro} al grupo!\n\nInvitado por: ${usuario}`,
                mentions: [m.messageStubParameters[0], m.sender]
            }, { quoted: fkontak })
        }
        
        // 32 = MIEMBROS AGREGADOS POR ADMIN
        else if (m.messageStubType == 32) {
            const agregados = m.messageStubParameters.map(p => `@${p.split('@')[0]}`).join(', ')
            await conn.sendMessage(m.chat, {
                text: `👥 *MIEMBROS AGREGADOS* 👥\n\n${usuario} agregó a:\n\n${agregados}`,
                mentions: [m.sender, ...m.messageStubParameters]
            }, { quoted: fkontak })
        }
        
        // 72 = CAMBIO DE DURACIÓN DE MENSAJES TEMPORALES
        else if (m.messageStubType == 72) {
            const duracion = m.messageStubParameters[0]
            let tiempo = ''
            
            if (duracion == '86400') tiempo = '24 horas'
            else if (duracion == '604800') tiempo = '7 días'
            else if (duracion == '7776000') tiempo = '90 días'
            else tiempo = `${duracion} segundos`
            
            await conn.sendMessage(m.chat, {
                text: `⏱️ *MENSAJES TEMPORALES* ⏱️\n\n${usuario} cambió la duración de los mensajes temporales a:\n\n⌛ *${tiempo}*`,
                mentions: [m.sender]
            }, { quoted: fkontak })
        }
        
        // 123 = DESACTIVAR MENSAJES TEMPORALES
        else if (m.messageStubType == 123) {
            await conn.sendMessage(m.chat, {
                text: `⏱️ *MENSAJES TEMPORALES* ⏱️\n\n${usuario} *DESACTIVÓ* los mensajes temporales.`,
                mentions: [m.sender]
            }, { quoted: fkontak })
        }
        
        // Evento desconocido - mostrar información para depuración
        else {
            console.log({
                messageStubType: m.messageStubType,
                messageStubParameters: m.messageStubParameters,
                type: WAMessageStubType[m.messageStubType]
            })
            
            // Opcional: notificar eventos desconocidos
            await conn.sendMessage(m.chat, {
                text: `🔍 *EVENTO DETECTADO* 🔍\n\nTipo: ${m.messageStubType}\nParámetros: ${JSON.stringify(m.messageStubParameters)}\nNombre: ${WAMessageStubType[m.messageStubType] || 'Desconocido'}`,
                mentions: [m.sender]
            }, { quoted: fkontak })
        }
        
    } catch (error) {
        console.error('Error en autodetect:', error)
    }
}
