package com.itgm.repository;

import com.itgm.domain.Script;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Script entity.
 */
@SuppressWarnings("unused")
public interface ScriptRepository extends JpaRepository<Script,Long> {

    @Query("select script from Script script where script.cenario.projeto.user.login = ?#{principal.username}")
    Page<Script> findByUserIsCurrentUser(Pageable pageable);

}
